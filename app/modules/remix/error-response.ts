import { jsonTyped } from "~/modules/remix/data"

export function errorResponse(message: string, status = 400) {
  return jsonTyped({ errorMessage: message }, status)
}
