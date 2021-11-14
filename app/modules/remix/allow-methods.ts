import { httpCodes } from "~/modules/network/http-codes"
import { responseTyped } from "~/modules/remix/data"

type HttpMethodUpper = "GET" | "POST" | "PATCH" | "DELETE" | "PUT"
type HttpMethod = HttpMethodUpper | Lowercase<HttpMethodUpper>

export function allowMethods<AllowedMethod extends HttpMethod>(
  request: Request,
  methods: AllowedMethod[],
): AllowedMethod {
  const method = request.method.toLowerCase() as HttpMethod

  const isAllowed = methods.map((m) => m.toLowerCase()).includes(method)
  if (!isAllowed) {
    throw responseTyped(undefined, httpCodes.methodNotAllowed)
  }

  return method as AllowedMethod
}
