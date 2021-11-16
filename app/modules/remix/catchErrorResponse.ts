import type { MaybePromise } from "~/modules/common/types"
import { errorResponse } from "~/modules/remix/error-response"

export async function catchErrorResponse<Result>(
  fn: () => MaybePromise<Result>,
) {
  try {
    return await fn()
  } catch (error) {
    if (error instanceof Response) return errorResponse(error)
    throw error
  }
}
