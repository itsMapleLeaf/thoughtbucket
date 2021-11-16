import type { Values } from "~/modules/common/types"

export type HttpCode = Values<typeof httpCodes>

export const httpCodes = {
  // 2xx Success
  ok: 200,
  created: 201,
  accepted: 202,

  // 3xx Redirection
  movedPermanently: 301,
  found: 302,
  seeOther: 303,
  notModified: 304,
  temporaryRedirect: 307,

  // 4xx Client Error
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  methodNotAllowed: 405,
  notAcceptable: 406,
  requestTimeout: 408,
  conflict: 409,
  gone: 410,
  lengthRequired: 411,
  preconditionFailed: 412,
  payloadTooLarge: 413,
  uriTooLong: 414,
  unsupportedMediaType: 415,
  rangeNotSatisfiable: 416,
  expectationFailed: 417,

  // 5xx Server Error
  internalServerError: 500,
  notImplemented: 501,
  badGateway: 502,
  serviceUnavailable: 503,
  gatewayTimeout: 504,
  httpVersionNotSupported: 505,
} as const
