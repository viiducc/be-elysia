import { DatabaseErrorCodes } from './db-error-codes.enum';
import { ErrorCodes } from './error-codes.enum';

const DEFAULT_STATUS_CODE = undefined;

export class ServerError extends Error {
  public readonly statusCode: number | undefined; // http status code (optional)
  public readonly code: ErrorCodes | DatabaseErrorCodes;

  // Flexible constructor
  // Ex: new ServerError(500, ErrorCodes.INTERNAL_SERVER_ERROR, 'Internal server error');
  // Ex: new ServerError(ErrorCodes.INTERNAL_SERVER_ERROR, 'Internal server error');
  // Ex: new ServerError('Internal server error');
  constructor(
    statusCode?: number | undefined | ErrorCodes | DatabaseErrorCodes | string,
    code?: ErrorCodes | DatabaseErrorCodes | string,
    message?: string,
  ) {
    // biome-ignore lint/complexity/noArguments: <Special case to handle multiple arguments number>
    const args = Array.from(arguments);
    if (args.length === 1) {
      statusCode = DEFAULT_STATUS_CODE;
      code = ErrorCodes.INTERNAL_SERVER_ERROR;
      message = args[0];
    } else if (args.length === 2) {
      statusCode = DEFAULT_STATUS_CODE;
      code = args[0] as ErrorCodes | DatabaseErrorCodes;
      message = args[1];
    } else if (args.length === 3) {
      statusCode = statusCode as number;
      code = code as ErrorCodes | DatabaseErrorCodes;
      message = message as string;
    }
    super(message);
    if (typeof code === 'string' && Object.values(ErrorCodes).includes(code as ErrorCodes)) {
      this.code = code as ErrorCodes;
    } else if (typeof code === 'string' && Object.values(DatabaseErrorCodes).includes(code as DatabaseErrorCodes)) {
      this.code = code as DatabaseErrorCodes;
    } else {
      this.code = ErrorCodes.INTERNAL_SERVER_ERROR;
    }
    this.statusCode = statusCode as number;
  }
}
