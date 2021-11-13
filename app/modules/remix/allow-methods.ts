import { httpCodes } from "~/modules/network/http-codes"
import { responseTyped } from "~/modules/remix/data"

type HttpMethodUpper = "GET" | "POST" | "PATCH" | "DELETE" | "PUT"
type HttpMethod = HttpMethodUpper | Lowercase<HttpMethodUpper>

export function allowMethods<AllowedMethod extends HttpMethod>(
  request: Request,
  ...methods: AllowedMethod[]
): AllowedMethod {
  const methodIsAllowed = methods
    .map((m) => m.toLowerCase())
    .includes(request.method.toLowerCase())

  if (!methodIsAllowed) {
    throw responseTyped(undefined, httpCodes.methodNotAllowed)
  }

  return request.method as AllowedMethod
}
