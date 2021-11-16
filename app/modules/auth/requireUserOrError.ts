import { sessionHelpers } from "~/modules/auth/session"
import { raise } from "~/modules/common/helpers"
import { httpCodes } from "~/modules/network/http-codes"
import { errorResponse } from "~/modules/remix/error-response"

export async function requireUserOrError(
  request: Request,
  errorMessage = "you must be logged in to do that",
) {
  const user = await sessionHelpers(request).getUser()
  return user ?? raise(errorResponse(errorMessage, httpCodes.unauthorized))
}
