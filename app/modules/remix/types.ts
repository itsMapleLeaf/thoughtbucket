import type { JsonValue } from "type-fest"

export type TypedResponse<T> = Response & { __type: T }

export function typedResponse<T>(
  data: BodyInit,
  init?: ResponseInit,
): TypedResponse<T> {
  return new Response(data, init) as TypedResponse<T>
}

export function typedJson<T extends JsonValue>(
  json: T,
  init?: number | ResponseInit,
): TypedResponse<T> {
  if (typeof init === "number") {
    init = { status: init }
  }
  return typedResponse(JSON.stringify(json), init)
}
