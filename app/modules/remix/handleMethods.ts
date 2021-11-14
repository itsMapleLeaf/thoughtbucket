import { raise } from "~/modules/common/helpers"
import type { Values } from "~/modules/common/types"
import { httpCodes } from "~/modules/network/http-codes"
import { responseTyped } from "~/modules/remix/data"

type HttpMethod = "get" | "post" | "patch" | "delete" | "put"
type Handler = () => Promise<unknown> | void
type HandlerRecord = Partial<Record<HttpMethod, Handler>>
type HandlerReturnTypes<Handlers extends HandlerRecord> = ReturnType<
  Exclude<Values<Handlers>, undefined>
>

export async function handleMethods<Handlers extends HandlerRecord>(
  request: Request,
  handlers: Handlers,
): Promise<HandlerReturnTypes<Handlers>> {
  const method = request.method.toLowerCase()

  const handler =
    (handlers as Record<string, Values<Handlers>>)[method] ??
    raise(responseTyped(undefined, httpCodes.methodNotAllowed))

  return (await handler()) as HandlerReturnTypes<Handlers>
}
