import { PencilAltIcon, TrashIcon } from "@heroicons/react/solid"
import type { User } from "@prisma/client"
import type { RuntimeContext, RuntimeResponse } from "next-runtime"
import { handle, json, notFound, redirect } from "next-runtime"
import { usePendingFormSubmit } from "next-runtime/form"
import type { ParsedUrlQuery } from "next-runtime/types/querystring"
import { useRef } from "react"
import { getClient } from "../../db/client"
import { pick, serialize } from "../../helpers"
import { AppLayout } from "../../modules/app/AppLayout"
import { usingSessionUser } from "../../modules/auth/usingSessionUser"
import type { ClientBucket } from "../../modules/bucket/BucketData"
import {
  bucketUpdateSchema,
  clientBucketSelection,
  createClientBucket,
  updateBucketData,
  usingClientBucket,
} from "../../modules/bucket/BucketData"
import { BucketPageSummary } from "../../modules/bucket/BucketPageSummary"
import { DeleteBucketButton } from "../../modules/bucket/DeleteBucketButton"
import { ColumnCard } from "../../modules/column/ColumnCard"
import { DeleteColumnButton } from "../../modules/column/DeleteColumnButton"
import { NewColumnForm } from "../../modules/column/NewColumnForm"
import { Button } from "../../modules/dom/Button"
import { getContextParam } from "../../modules/routing/getContextParam"
import { NewThoughtForm } from "../../modules/thought/NewThoughtForm"
import { ThoughtCard } from "../../modules/thought/ThoughtCard"
import { fadedButtonClass } from "../../modules/ui/button"
import { containerClass } from "../../modules/ui/container"
import { leftButtonIconClass } from "../../modules/ui/icon"

type Props = {
  user: Pick<User, "name">
  bucket: ClientBucket
  errorMessage?: string
}

function usingOwnedBucket<Result>(
  context: RuntimeContext<ParsedUrlQuery>,
  bucketId: string,
  fn: (user: User, bucket: ClientBucket) => Result,
): Promise<Result | RuntimeResponse<never>> {
  return usingSessionUser(context, (user) => {
    return usingClientBucket(bucketId, (bucket) => {
      return bucket.ownerId === user.id ? fn(user, bucket) : notFound(401)
    })
  })
}

export const getServerSideProps = handle<Props>({
  get: async (context) => {
    return usingSessionUser(context, (user) => {
      const bucketId = getContextParam(context, "bucketId")
      return usingClientBucket(bucketId, (bucket) => {
        return json<Props>({
          user: pick(user, ["name"]),
          bucket: serialize(bucket),
        })
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
    const bucketId = getContextParam(context, "bucketId")
    const updates = bucketUpdateSchema.parse(context.req.body)

    return usingOwnedBucket(context, bucketId, async (user, bucket) => {
      try {
        const newData = updateBucketData(bucket, updates)

        const newBucket = await db.bucket.update({
          where: { id: bucketId },
          data: {
            name: updates.name,
            data: JSON.stringify(newData),
          },
          select: clientBucketSelection,
        })

        return json({
          user,
          bucket: createClientBucket(newBucket),
        })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn("update error", error)

        // if something goes wrong during the update,
        // just return the current bucket
        return json({
          user,
          bucket,
          errorMessage: "oops, something went wrong. try again",
        })
      }
    })
  },
})

export default function BucketPage({ user, bucket, errorMessage }: Props) {
  const columnScrollContainerRef = useRef<HTMLDivElement>(null)
  const pending = usePendingFormSubmit() as { data: FormData } | undefined
  const newColumnName = pending?.data.get("createColumn.name")
  const deletedColumnId = pending?.data.get("deleteColumn.id")

  return (
    <AppLayout user={user}>
      <div className="flex flex-col h-full">
        <section
          className={`${containerClass} flex flex-wrap items-baseline gap-x-4 gap-y-2`}
        >
          <div className="mr-auto">
            <BucketPageSummary {...bucket} />
          </div>

          <div className="flex gap-4">
            <Button className={fadedButtonClass}>
              <PencilAltIcon className={leftButtonIconClass} /> rename
            </Button>
            <DeleteBucketButton
              bucket={bucket}
              className={fadedButtonClass}
              data-testid="bucket-page-delete"
            >
              <TrashIcon className={leftButtonIconClass} /> delete
            </DeleteBucketButton>
          </div>
        </section>

        {errorMessage && <p>{errorMessage}</p>}

        <section
          className="grid grid-flow-col gap-4 p-4 auto-cols-[18rem] grid-rows-1 mx-auto min-w-[min(1024px,100%)] max-w-full overflow-auto flex-1"
          ref={columnScrollContainerRef}
        >
          {bucket.data.columns.map((column) => (
            <ColumnCard key={column.id} pending={column.id === deletedColumnId}>
              <ColumnCard.Header
                title={column.name}
                right={<DeleteColumnButton bucket={bucket} column={column} />}
              />
              <ColumnCard.Section>
                <NewThoughtForm bucket={bucket} column={column} />
              </ColumnCard.Section>
              <ColumnCard.CardList>
                {column.thoughts.map((thought) => (
                  <li key={thought.id}>
                    <ThoughtCard thought={thought} />
                  </li>
                ))}
              </ColumnCard.CardList>
            </ColumnCard>
          ))}

          {newColumnName && (
            <ColumnCard pending>
              <ColumnCard.Header title={newColumnName} />
            </ColumnCard>
          )}

          <div>
            <NewColumnForm bucket={bucket} />
          </div>
        </section>
      </div>
    </AppLayout>
  )
}
