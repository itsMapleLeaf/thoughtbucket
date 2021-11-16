import type { ResponseTyped } from "~/modules/remix/data"
import { jsonTyped } from "~/modules/remix/data"

export type ErrorResponse = ResponseTyped<{ errorMessage: string }>

export function errorResponse(
  ...args: [message: string, status: number] | [response: Response]
): ErrorResponse {
  if (args.length === 1) {
    const [response] = args
    return jsonTyped({ errorMessage: response.statusText }, response.status)
  }

  const [errorMessage, status] = args
  return jsonTyped({ errorMessage }, { status, statusText: errorMessage })
}
