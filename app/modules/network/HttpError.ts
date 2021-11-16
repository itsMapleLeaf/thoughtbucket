import type { HttpCode } from "~/modules/network/http-codes"
import { httpCodes } from "~/modules/network/http-codes"

export class HttpError extends Error {
  constructor(
    message: string,
    public code: HttpCode = httpCodes.internalServerError,
  ) {
    super(message)
  }
}
