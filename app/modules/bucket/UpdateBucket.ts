import { useFetcher } from "remix"
import { z } from "zod"
import type { DatabaseBucket } from "~/modules/bucket/DatabaseBucket"
import { getClient } from "~/modules/db"
import { createFormHelpers } from "~/modules/remix/form"

export type UpdateBucketInput = z.input<typeof updateBucketBodySchema>
export type UpdateBucketOutput = z.output<typeof updateBucketBodySchema>

type ColumnDatabaseInput = {
  id?: string
  name: string
  order: number
  created?: boolean
  deleted?: boolean
}

const updateBucketBodySchema = z.object({
  name: z.string().optional(),
  createColumnName: z.string().optional(),
  deleteColumnId: z.string().optional(),
  reorderColumnId: z.string().optional(),
  reorderColumnOrder: z
    .string()
    .optional()
    .transform((input) =>
      input ? z.number().parse(Number(input)) : undefined,
    ),
})

export const UpdateBucketForm = createFormHelpers(updateBucketBodySchema)

export function useUpdateBucketFetcher(bucketId: string) {
  const fetcher = useFetcher()
  return {
    ...fetcher,
    submit(body: UpdateBucketInput) {
      fetcher.submit(body, {
        method: "patch",
        action: `/buckets/${bucketId}`,
      })
    },
  }
}

export async function updateBucket(bucket: DatabaseBucket, request: Request) {
  const [body, bodyError] = await UpdateBucketForm.getBody(request)
  if (!body) return bodyError

  const db = getClient()

  let columns: ColumnDatabaseInput[] = [...bucket.columns]

  if (body.createColumnName) {
    columns.push({
      name: body.createColumnName,
      order: 0,
      created: true,
    })
  }

  if (body.deleteColumnId) {
    columns = bucket.columns.map<ColumnDatabaseInput>((column) => ({
      ...column,
      deleted: column.id === body.deleteColumnId,
    }))
  }

  if (body.reorderColumnId && body.reorderColumnOrder != null) {
    const index = columns.findIndex(
      (column) => column.id === body.reorderColumnId,
    )
    if (index > -1) {
      const removed = columns.splice(index, 1)
      columns.splice(body.reorderColumnOrder, 0, ...removed)
    }
  }

  const columnsToUpsert = columns
    .filter((column) => !column.deleted)
    .map((column, order) => ({ ...column, order }))

  const columnsToDelete = columns.filter((column) => column.deleted)

  await db.bucket.update({
    where: { id: bucket.id },
    data: {
      name: body.name || bucket.name,
      columns: {
        upsert: columnsToUpsert.map((column) => ({
          where: { id: column.id ?? "" },
          update: { name: column.name, order: column.order },
          create: { name: column.name, order: column.order },
        })),
        delete: columnsToDelete.map((column) => ({ id: column.id })),
      },
    },
  })
}
