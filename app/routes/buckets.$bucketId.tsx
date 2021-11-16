import type { DataFunctionArgs } from "@remix-run/server-runtime"
import type { MetaFunction } from "remix"
import { AppLayout } from "~/modules/app/AppLayout"
import { getAppMeta } from "~/modules/app/getAppMeta"
import { sessionHelpers } from "~/modules/auth/session"
import { BucketPageHeader } from "~/modules/bucket/BucketPageHeader"
import { asClientBucket } from "~/modules/bucket/ClientBucket"
import { requireBucket } from "~/modules/bucket/requireBucket"
import { requireOwnedBucket } from "~/modules/bucket/requireOwnedBucket"
import { updateBucket } from "~/modules/bucket/UpdateBucket"
import { ColumnEditor } from "~/modules/column/ColumnEditor"
import { pick, raise } from "~/modules/common/helpers"
import { serialize } from "~/modules/common/serialize"
import { getClient } from "~/modules/db"
import { httpCodes } from "~/modules/network/http-codes"
import {
  jsonTyped,
  redirectTyped,
  useLoaderDataTyped,
} from "~/modules/remix/data"
import { handleMethods } from "~/modules/remix/handleMethods"

export async function loader({ request, params }: DataFunctionArgs) {
  const user = await sessionHelpers(request).getUser()

  const bucketId = params.bucketId ?? raise("bucketId param not found")
  const bucket = await requireBucket(bucketId)

  return jsonTyped(
    serialize({
      user: user ? pick(user, ["name"]) : undefined,
      bucket: asClientBucket(bucket),
    }),
  )
}

export async function action({ request, params }: DataFunctionArgs) {
  const db = getClient()
  const bucketId = params.bucketId ?? raise("bucketId param not found")

  return handleMethods(request, {
    async patch() {
      let { bucket } = await requireOwnedBucket(request, bucketId)
      await updateBucket(bucket, request)
      return redirectTyped(`/buckets/${bucketId}`, httpCodes.seeOther)
    },

    async delete() {
      await requireOwnedBucket(request, bucketId)

      await db.bucket.delete({
        where: { id: bucketId },
      })

      return redirectTyped(`/buckets`, httpCodes.seeOther)
    },
  })
}

export const meta: MetaFunction = ({ data }) => getAppMeta(data.bucket.name)

export default function BucketDetails() {
  const { user, bucket } = useLoaderDataTyped<typeof loader>()

  return (
    <AppLayout user={user}>
      <div className="flex flex-col h-full">
        <BucketPageHeader bucket={bucket} />
        <ColumnEditor bucket={bucket} />
      </div>
    </AppLayout>
  )
}

// function FetchStatusIndicator({ store }: { store: ColumnEditorStore }) {
//   const state = useObservable(store.fetchStream, { status: "idle" as const })

//   return (
//     <div
//       data-testid={`fetch-status-${state.status}`}
//       className="fixed bottom-0 right-0 p-4"
//     >
//       {state.status === "error" ? (
//         <div title="Failed to save changes">
//           <XCircleIcon className="w-6 text-red-400 drop-shadow" />
//         </div>
//       ) : state.status === "success" ? (
//         <div title="Changes saved successfully.">
//           <CheckCircleIcon className="w-6 text-green-400 drop-shadow " />
//         </div>
//       ) : state.status === "loading" ? (
//         <div title="Saving changes..." className="p-0.5">
//           <LoadingIcon size={2} />
//         </div>
//       ) : null}
//     </div>
//   )
// }
