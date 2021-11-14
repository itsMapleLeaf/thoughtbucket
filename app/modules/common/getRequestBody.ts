import type { JsonValue } from "type-fest"

export async function getRequestBody(request: Request): Promise<JsonValue> {
  if (request.headers.get("Content-Type") === "application/json") {
    return request.json()
  }
  return Object.fromEntries(new URLSearchParams(await request.text()))
}
