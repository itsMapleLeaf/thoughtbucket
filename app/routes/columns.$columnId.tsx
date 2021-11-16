import type { DataFunctionArgs } from "@remix-run/server-runtime"
import { deleteColumn } from "~/modules/column/deleteColumn"
import { getColumn } from "~/modules/column/getColumn"
import { updateColumn } from "~/modules/column/updateColumn"
import { raise } from "~/modules/common/helpers"
import { httpCodes } from "~/modules/network/http-codes"
import { catchErrorResponse } from "~/modules/remix/catchErrorResponse"
import { redirectTyped } from "~/modules/remix/data"
import { handleMethods } from "~/modules/remix/handleMethods"

export async function loader({ params }: DataFunctionArgs) {
  const columnId = params.columnId ?? raise("columnId param not found")
  const { bucketId } = await getColumn(columnId)
  return redirectTyped(`/buckets/${bucketId}`, httpCodes.seeOther)
}

export async function action({ request, params }: DataFunctionArgs) {
  const columnId = params.columnId ?? raise("columnId param not found")

  return catchErrorResponse(async () => {
    const { bucketId } = await getColumn(columnId)

    await handleMethods(request, {
      async delete() {
        await deleteColumn(columnId, request)
      },
      async patch() {
        await updateColumn(columnId, request)
      },
    })

    return redirectTyped(`/buckets/${bucketId}`, httpCodes.seeOther)
  })
}

export default function ColumnPage() {
  return null
}
