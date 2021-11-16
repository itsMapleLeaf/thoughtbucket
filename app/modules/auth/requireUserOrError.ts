import { sessionHelpers } from "~/modules/auth/session"
import { raise } from "~/modules/common/helpers"
import { httpCodes } from "~/modules/network/http-codes"
import { HttpError } from "~/modules/network/HttpError"

export async function requireUserOrError(
  request: Request,
  errorMessage = "you must be logged in to do that",
) {
  const user = await sessionHelpers(request).getUser()
  return user ?? raise(new HttpError(errorMessage, httpCodes.unauthorized))
}
