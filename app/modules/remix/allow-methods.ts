import { httpCodes } from "~/modules/network/http-codes"
import { responseTyped } from "~/modules/remix/data"

type HttpMethodUpper = "GET" | "POST" | "PATCH" | "DELETE" | "PUT"
type HttpMethodLower = Lowercase<HttpMethodUpper>
type HttpMethod = HttpMethodUpper | HttpMethodLower

export function allowMethods<AllowedMethod extends HttpMethod>(
  request: Request,
  methods: AllowedMethod[],
): Lowercase<AllowedMethod> {
  const method = request.method.toLowerCase() as Lowercase<AllowedMethod>

  const isAllowed = methods.map((m) => m.toLowerCase()).includes(method)
  if (!isAllowed) {
    throw responseTyped(undefined, httpCodes.methodNotAllowed)
  }

  return method
}
