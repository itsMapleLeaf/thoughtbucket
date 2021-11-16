import type { DataFunctionArgs } from "@remix-run/server-runtime"
import { createColumn } from "~/modules/column/createColumn"
import { CreateColumnForm } from "~/modules/column/CreateColumnForm"
import { catchErrorResponse } from "~/modules/remix/catchErrorResponse"
import { redirectTyped } from "~/modules/remix/data"
import { handleMethods } from "~/modules/remix/handleMethods"

export async function action({ request }: DataFunctionArgs) {
  return catchErrorResponse(() => {
    return handleMethods(request, {
      async post() {
        const body = await CreateColumnForm.getBody(request)
        await createColumn(body, request)
        return redirectTyped(`/buckets/${body.bucketId}`)
      },
    })
  })
}

export default function ColumnListPage() {
  return null
}
