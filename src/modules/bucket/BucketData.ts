import produce from "immer"
import { nanoid } from "nanoid"
import type { RuntimeResponse } from "next-runtime"
import { notFound } from "next-runtime"
import { z } from "zod"
import { getClient } from "../../db/client"
import { serialize } from "../../helpers"

export type BucketData = z.TypeOf<typeof bucketDataSchema>

const bucketDataSchema = z.object({
  columns: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      thoughts: z.array(
        z.object({
          id: z.string(),
          text: z.string(),
        }),
      ),
    }),
  ),
})

export type BucketUpdate = z.TypeOf<typeof bucketUpdateSchema>

export const bucketUpdateSchema = z.object({
  name: z.string().optional(),
  createColumn: z.object({ name: z.string() }).optional(),
  deleteColumn: z.object({ id: z.string() }).optional(),
  createThought: z
    .object({ columnId: z.string(), text: z.string() })
    .optional(),
})

export function updateBucketData(bucket: ClientBucket, updates: BucketUpdate) {
  return produce(bucket.data, (draft) => {
    if (updates.createColumn) {
      draft.columns.push({
        id: nanoid(),
        name: updates.createColumn.name,
        thoughts: [],
      })
    }

    draft.columns = draft.columns.filter(
      (c) => c.id !== updates.deleteColumn?.id,
    )

    if (updates.createThought) {
      const column = draft.columns.find(
        (c) => c.id === updates.createThought?.columnId,
      )
      column?.thoughts.unshift({
        id: nanoid(),
        text: updates.createThought.text,
      })
    }
  })
}

export type ClientBucket = {
  name: string
  id: string
  createdAt: string
  ownerId: string
  data: BucketData
}

export const clientBucketSelection = {
  id: true,
  name: true,
  createdAt: true,
  ownerId: true,
  data: true,
} as const

export async function usingClientBucket<Result>(
  bucketId: string,
  fn: (bucket: ClientBucket) => Result,
): Promise<Result | RuntimeResponse<never>> {
  const db = getClient()

  const bucket = await db.bucket.findUnique({
    where: {
      id: bucketId,
    },
    select: clientBucketSelection,
  })

  if (!bucket) {
    return notFound()
  }

  return fn(createClientBucket(bucket))
}

export function createClientBucket(bucket: {
  data: string
  id: string
  name: string
  createdAt: Date
  ownerId: string
}) {
  const data = bucketDataSchema.parse(JSON.parse(bucket.data))
  const serializedBucket = serialize({ ...bucket, data })
  return serializedBucket
}
