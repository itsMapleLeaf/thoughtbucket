import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/outline"
import type { User } from "@prisma/client"
import { handle, json, notFound, redirect } from "next-runtime"
import { useMemo } from "react"
import { z } from "zod"
import { AppHead } from "../../modules/app/AppHead"
import { AppLayout } from "../../modules/app/AppLayout"
import { sessionHelpers } from "../../modules/auth/session"
import { BucketPageHeader } from "../../modules/bucket/BucketPageHeader"
import type { ClientBucket } from "../../modules/bucket/ClientBucket"
import { asClientBucket } from "../../modules/bucket/ClientBucket"
import { usingBucket } from "../../modules/bucket/usingBucket"
import { usingOwnedBucket } from "../../modules/bucket/usingOwnedBucket"
import type { Column } from "../../modules/column/Column"
import { columnSchema } from "../../modules/column/Column"
import { ColumnEditor } from "../../modules/column/ColumnEditor"
import { ColumnEditorStore } from "../../modules/column/ColumnEditorStore"
import { pick } from "../../modules/common/helpers"
import { getClient } from "../../modules/db"
import { httpCodes } from "../../modules/network/http-codes"
import { getContextParam } from "../../modules/routing/getContextParam"
import { useObservable } from "../../modules/rxjs/useObservable"
import { LoadingIcon } from "../../modules/ui/LoadingIcon"

type Props = {
  user?: Pick<User, "name">
  bucket: ClientBucket
  columns: Column[]
  errorMessage?: string
}

const patchBodySchema = z.object({
  name: z.string().optional(),
  columns: z.array(columnSchema).optional(),
})

export const getServerSideProps = handle<Props>({
  get: async (context) => {
    const user = await sessionHelpers(context).getUser()
    const bucketId = getContextParam(context, "bucketId")
    return usingBucket(bucketId, (bucket) => {
      return json<Props>({
        user: user ? pick(user, ["name"]) : undefined,
        bucket: asClientBucket(bucket),
        columns: z.array(columnSchema).parse(bucket.columns),
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

    const user = await sessionHelpers(context).getUser()

    if (bucket.ownerId !== user?.id) {
      return json(
        {
          bucket: asClientBucket(bucket),
          columns: z.array(columnSchema).parse(bucket.columns),
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

    return redirect(`/buckets/${bucketId}`, 303)
  },
})

export default function BucketPage({
  user,
  bucket,
  columns: initialColumns,
}: Props) {
  const store = useMemo(
    () => new ColumnEditorStore(bucket.id, initialColumns),
    [bucket.id, initialColumns],
  )

  return (
    <AppLayout user={user}>
      <AppHead title={bucket.name} />
      <div className="flex flex-col h-full">
        <BucketPageHeader bucket={bucket} />
        <ColumnEditor store={store} />
        <FetchStatusIndicator store={store} />
      </div>
    </AppLayout>
  )
}

function FetchStatusIndicator({ store }: { store: ColumnEditorStore }) {
  const state = useObservable(store.fetchStream, { status: "idle" as const })

  return (
    <div
      data-testid={`fetch-status-${state.status}`}
      className="fixed bottom-0 right-0 p-4"
    >
      {state.status === "error" ? (
        <div title="Failed to save changes">
          <XCircleIcon className="w-6 text-red-400 drop-shadow" />
        </div>
      ) : state.status === "success" ? (
        <div title="Changes saved successfully.">
          <CheckCircleIcon className="w-6 text-green-400 drop-shadow " />
        </div>
      ) : state.status === "loading" ? (
        <div title="Saving changes..." className="p-0.5">
          <LoadingIcon size={2} />
        </div>
      ) : null}
    </div>
  )
}
