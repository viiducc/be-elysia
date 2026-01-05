import { Elysia } from 'elysia';

const toCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key.replace(/_([a-z])/g, (_, c) => c.toUpperCase()), toCamelCase(value)]));
  }
  return obj;
};

const toSnakeCase = (obj: any): any => {
  if (Array.isArray(obj)) return obj.map(toSnakeCase);
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key.replace(/([A-Z])/g, '_$1').toLowerCase(), toSnakeCase(value)]));
  }
  return obj;
};

// From { response_value: 'value' } to { responseValue: 'value' }
export const responsePropertyCaseConverter = new Elysia().onBeforeHandle(({ query, body, set }) => {
  if (query && typeof query === 'object') {
    Object.assign(query, toCamelCase(query));
  }
  if (body && typeof body === 'object') {
    Object.assign(body, toCamelCase(body));
  }
});

// From { responseValue: 'value' } to { response_value: 'value' }
export const queryCaseConverter = new Elysia().onAfterHandle(({ response, set }) => {
  if (response && typeof response === 'object') {
    set.headers['Content-Type'] = 'application/json';
    return toSnakeCase(response);
  }
  return response;
});
