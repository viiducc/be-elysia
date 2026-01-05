import { Elysia, ValidationError } from 'elysia';
import { appConfig } from '@/config/app.config';
import { PaginationResult } from '@/src/infrastructure/sql-repository';
import { ServerError } from '@/src/shared/errors/error';
import { ErrorCodes, HttpStatusCodesMap } from '@/src/shared/errors/error-codes.enum';

// Base response structure
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: ErrorDetails;
  meta?: {
    pagination?: Pagination;
  };
}

interface ErrorDetails {
  code: string;
  message: string;
  data?: any;
}

interface Pagination {
  // Offset-based pagination
  total?: number;
  totalPages?: number;
  page?: number;
  perPage?: number;

  // Cursor-based pagination
  nextCursor?: string;
  prevCursor?: string;
  limit?: number; // Same as 'perPage' but with different name
}

class ResponseBuilder {
  success<T = any>(data: T, message: string = 'Success'): ApiResponse<T> {
    const resp: ApiResponse<T> = {
      success: true,
      message,
    };
    if (data) {
      resp.data = data;
    }
    return resp;
  }

  error(code: string, message: string, data?: any): ApiResponse<null> {
    const error: ErrorDetails = { code, message };
    if (data && appConfig.env === 'development') {
      error.data = data;
    }
    return {
      success: false,
      message,
      error,
    };
  }

  successWithPagination<T = any>(data: T[], pagination: Pagination = {}, message: string = 'Success'): ApiResponse<T[]> {
    let meta: { pagination: Pagination };

    if (pagination.page && pagination.perPage) {
      meta = {
        pagination: {
          total: pagination.total,
          totalPages: pagination.totalPages,
          page: pagination.page,
          perPage: pagination.perPage,
        },
      };
    } else if ((pagination.nextCursor || pagination.prevCursor) && pagination.limit) {
      meta = {
        pagination: {
          nextCursor: pagination.nextCursor,
          prevCursor: pagination.prevCursor,
          limit: pagination.limit,
        },
      };
    } else {
      meta = {
        pagination: {
          total: data.length,
          totalPages: 1,
          page: 1,
          perPage: data.length,
        },
      };
    }

    return {
      success: true,
      message,
      data,
      meta,
    };
  }

  successWithoutPagination<T = any>(data: T[], message: string = 'Success'): ApiResponse<T[]> {
    return this.successWithPagination(data, undefined, message);
  }
}

interface ErrorResponse {
  systemCode: string;
  httpCode: number;
  message: string;
  stack: any;
}

const responseBuilder = new ResponseBuilder();

/**
 * @description Response handler middleware that handle: response, error, pagination, etc.
 */
export const responseMiddleware = new Elysia()
  .error({
    ServerError,
  })
  .onError({ as: 'global' }, ({ error, set }) => {
    let errorHandler: (error: ValidationError | ServerError | Error | any) => ErrorResponse;

    switch (true) {
      case error instanceof ValidationError:
        errorHandler = getValidationErrors;
        break;
      case error instanceof ServerError:
        errorHandler = getServerError;
        break;
      default:
        errorHandler = getError;
    }

    const { systemCode, httpCode, message, stack } = errorHandler(error);
    set.status = httpCode;
    set.headers['Content-Type'] = 'application/json';

    return JSON.stringify(responseBuilder.error(systemCode, message, stack));
  })
  .onAfterHandle({ as: 'global' }, ({ response, set }) => {
    if (set.headers['Content-Type'] === undefined || set.headers['Content-Type'] === 'application/json') {
      set.headers['Content-Type'] = 'application/json';
      switch (true) {
        case response instanceof PaginationResult:
          return JSON.stringify(
            responseBuilder.successWithPagination(response.items, {
              total: response.totalItems,
              totalPages: response.totalPages,
              page: response.page,
              perPage: response.perPage,
            }),
          );
        case response instanceof ServerError:
          throw response;
        case Array.isArray(response):
          return JSON.stringify(responseBuilder.successWithoutPagination(response));
        case response instanceof Object:
          return JSON.stringify(responseBuilder.success(response));
        case response === undefined || response === null:
          return JSON.stringify(responseBuilder.success(null));
        default:
          return response;
      }
      // if (response instanceof Object) {
      //   if (Array.isArray(response)) {
      //     return JSON.stringify(responseBuilder.successWithoutPagination(response));
      //   }
      //   if (response instanceof PaginationResult) {
      //     return JSON.stringify(
      //       responseBuilder.successWithPagination(response.items, {
      //         total: response.totalItems,
      //         page: response.page,
      //         perPage: response.perPage,
      //       }),
      //     );
      //   }
      //   if (response instanceof ServerError) {
      //     throw response;
      //   }
      //   return JSON.stringify(responseBuilder.success(response));
      // }
      // if (response === undefined || response === null) {
      //   return JSON.stringify(responseBuilder.success(null));
      // }
    }
    return response;
  });

function getValidationErrors(error: ValidationError): ErrorResponse {
  const errors = error.validator.Errors(error.value);
  const stack = [...errors].reduce((acc, err) => {
    let path = err.path?.substring(err.path.lastIndexOf('/') + 1);
    let message = err.message;

    if (!path && message === 'Expected object') {
      path = 'request';
      message = 'Invalid request: Unexpected request or missing required fields';
    }
    acc.push({ field: path, message });
    return acc;
  }, []);

  return {
    systemCode: ErrorCodes.VALIDATION_FAILED,
    httpCode: 400,
    message: `${stack?.[0]?.field}: ${stack?.[0]?.message}` || 'Validation failed',
    stack,
  };
}

function getServerError(error: ServerError): ErrorResponse {
  let msg = error.message;
  if (error.code === ErrorCodes.DATABASE_ERROR && appConfig.env !== 'development') {
    msg = 'Internal server error';
  }
  return {
    systemCode: error.code as string,
    httpCode: error.statusCode && error.statusCode < 500 ? error.statusCode : HttpStatusCodesMap.get(error.code as ErrorCodes) || 500,
    message: msg,
    stack: error.stack,
  };
}

function getError(error: Error | any): ErrorResponse {
  return {
    systemCode: ErrorCodes.INTERNAL_SERVER_ERROR,
    httpCode: 500,
    message: error.message || 'Internal server error',
    stack: error.stack,
  };
}
