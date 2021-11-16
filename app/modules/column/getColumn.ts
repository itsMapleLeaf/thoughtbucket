import { raise } from "~/modules/common/helpers"
import { getClient } from "~/modules/db"
import { httpCodes } from "~/modules/network/http-codes"
import { errorResponse } from "~/modules/remix/error-response"

export async function getColumn(columnId: string) {
  const db = getClient()

  const column = await db.column.findUnique({
    where: { id: columnId },
    select: { bucketId: true },
  })

  return column ?? raise(errorResponse("column not found", httpCodes.notFound))
}
