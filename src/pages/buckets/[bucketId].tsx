import type { User } from "@prisma/client"
import { handle, json, notFound, redirect } from "next-runtime"
import { useMemo, useState } from "react"
import { z } from "zod"
import { getClient } from "../../db/client"
import { createSessionHelpers } from "../../db/session"
import { pick } from "../../helpers"
import { httpCodes } from "../../http-codes"
import { AppLayout } from "../../modules/app/AppLayout"
import { BucketPageColumns } from "../../modules/bucket/BucketPageColumns"
import { BucketPageHeader } from "../../modules/bucket/BucketPageHeader"
import type { ClientBucket } from "../../modules/bucket/ClientBucket"
import { asClientBucket } from "../../modules/bucket/ClientBucket"
import { usingBucket } from "../../modules/bucket/usingBucket"
import { usingOwnedBucket } from "../../modules/bucket/usingOwnedBucket"
import type { BucketColumn } from "../../modules/column/BucketColumn"
import { bucketColumnSchema } from "../../modules/column/BucketColumn"
import { fetchJsonWithRetry } from "../../modules/network/fetchWithRetry"
import { getContextParam } from "../../modules/routing/getContextParam"
import { useObservable } from "../../modules/rxjs/useObservable"

type Props = {
  user?: Pick<User, "name">
  bucket: ClientBucket
  columns: BucketColumn[]
  errorMessage?: string
}

const patchBodySchema = z.object({
  name: z.string().optional(),
  columns: z.array(bucketColumnSchema).optional(),
})

export const getServerSideProps = handle<Props>({
  get: async (context) => {
    const user = await createSessionHelpers(context).getUser()
    const bucketId = getContextParam(context, "bucketId")
    return usingBucket(bucketId, (bucket) => {
      return json<Props>({
        user: user ? pick(user, ["name"]) : undefined,
        bucket: asClientBucket(bucket),
        columns: z.array(bucketColumnSchema).parse(bucket.columns),
      })
    })
  },

  delete: async (context) => {
    const db = getClient()
    const bucketId = getContextParam(context, "bucketId")
    return usingOwnedBucket(context, bucketId, async () => {
      await db.bucket.delete({ where: { id: bucketId } })
      return redirect("/buckets", 303)
    })
  },

  patch: async (context) => {
    const db = getClient()
    const body = patchBodySchema.parse(context.req.body)
    const bucketId = getContextParam(context, "bucketId")

    const bucket = await db.bucket.findUnique({
      where: {
        id: bucketId,
      },
    })
    if (!bucket) {
      return notFound()
    }

    const user = await createSessionHelpers(context).getUser()

    if (bucket.ownerId !== user?.id) {
      return json(
        {
          bucket: asClientBucket(bucket),
          columns: z.array(bucketColumnSchema).parse(bucket.columns),
        },
        httpCodes.forbidden,
      )
    }

    await db.bucket.update({
      where: {
        id: bucketId,
      },
      data: {
        name: body.name,
        columns: body.columns,
      },
    })

    return json(
      {
        user: pick(user, ["name"]),
        bucket: asClientBucket(bucket),
        columns: z.array(bucketColumnSchema).parse(bucket.columns),
      },
      httpCodes.ok,
    )
  },
})

export default function BucketPage({
  user,
  bucket,
  columns: initialColumns,
}: Props) {
  const [columns, setColumns] = useState(initialColumns)

  const fetchState = useObservable(
    useMemo(() => {
      if (columns === initialColumns) return

      return fetchJsonWithRetry({
        url: window.location.pathname,
        method: "patch",
        data: { columns },
      })
    }, [columns, initialColumns]),
    { status: "init" as const },
  )

  return (
    <AppLayout user={user}>
      <div className="flex flex-col h-full">
        <BucketPageHeader bucket={bucket} />
        <pre>{fetchState.status === "error" && fetchState.error.message}</pre>
        <BucketPageColumns columns={columns} onChange={setColumns} />
        <div className={"flex-1"}></div>
      </div>
    </AppLayout>
  )
}
