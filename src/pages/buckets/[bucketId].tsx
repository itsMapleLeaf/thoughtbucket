import { PencilAltIcon, TrashIcon } from "@heroicons/react/solid"
import type { User } from "@prisma/client"
import clsx from "clsx"
import type { RuntimeContext, RuntimeResponse } from "next-runtime"
import { handle, json, notFound, redirect } from "next-runtime"
import { usePendingFormSubmit } from "next-runtime/form"
import type { ParsedUrlQuery } from "next-runtime/types/querystring"
import type { ReactNode } from "react"
import { useRef } from "react"
import { z } from "zod"
import { getClient } from "../../db/client"
import { createSessionHelpers } from "../../db/session"
import { pick, raise, serialize } from "../../helpers"
import { AppLayout } from "../../modules/app/AppLayout"
import { BucketPageSummary } from "../../modules/bucket/BucketPageSummary"
import { DeleteBucketButton } from "../../modules/bucket/DeleteBucketButton"
import { ColumnHeader } from "../../modules/column/ColumnHeader"
import { DeleteColumnButton } from "../../modules/column/DeleteColumnButton"
import { NewColumnForm } from "../../modules/column/NewColumnForm"
import { Button } from "../../modules/dom/Button"
import { ThoughtCard } from "../../modules/thought/ThoughtCard"
import { fadedButtonClass } from "../../modules/ui/button"
import { cardClass } from "../../modules/ui/card"
import { containerClass } from "../../modules/ui/container"
import { leftButtonIconClass } from "../../modules/ui/icon"
import type { MaybePromise } from "../../types"

type ClientBucket = {
  name: string
  id: string
  createdAt: string
  ownerId: string
  columns: Array<{ id: string; name: string }>
}

type Props = {
  user: Pick<User, "name">
  bucket: ClientBucket
  errorMessage?: string
}

const db = getClient()

const bucketUpdateSchema = z.object({
  name: z.string().optional(),
  createColumn: z.object({ name: z.string() }).optional(),
  deleteColumn: z.object({ id: z.string() }).optional(),
})

async function usingSessionUser<Result>(
  context: RuntimeContext<ParsedUrlQuery>,
  fn: (user: User) => MaybePromise<Result>,
): Promise<Result | RuntimeResponse<never>> {
  const user = await createSessionHelpers(context).getUser()
  return user ? fn(user) : redirect("/login", 303)
}

function usingContextParam<Result>(
  context: RuntimeContext<ParsedUrlQuery>,
  name: string,
  fn: (value: string) => Result,
): Result {
  const value = context.query[name]
  return value ? fn(String(value)) : raise(`Missing params ${name}`)
}

async function usingClientBucket<Result>(
  bucketId: string,
  fn: (bucket: ClientBucket) => Result,
): Promise<Result | RuntimeResponse<never>> {
  const bucket = await db.bucket.findUnique({
    where: {
      id: bucketId,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      ownerId: true,
      columns: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })
  return bucket ? fn(serialize(bucket)) : notFound()
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
      return usingContextParam(context, "bucketId", async (bucketId) => {
        return usingClientBucket(bucketId, async (bucket) => {
          return json<Props>({
            user: pick(user, ["name"]),
            bucket: serialize(bucket),
          })
        })
      })
    })
  },

  delete: async (context) => {
    return usingContextParam(context, "bucketId", (bucketId) => {
      return usingOwnedBucket(context, bucketId, async () => {
        await db.bucket.delete({ where: { id: bucketId } })
        return redirect("/buckets", 303)
      })
    })
  },

  patch: async (context) => {
    return usingContextParam(context, "bucketId", (bucketId) => {
      return usingOwnedBucket(context, bucketId, async (user, bucket) => {
        const { name, createColumn, deleteColumn } = bucketUpdateSchema.parse(
          context.req.body,
        )

        try {
          const newBucket = await db.bucket.update({
            where: { id: bucketId },
            data: {
              name,
              columns: {
                create: createColumn,
                delete: deleteColumn,
              },
            },
            select: {
              id: true,
              name: true,
              createdAt: true,
              ownerId: true,
              columns: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          })
          return json({
            user,
            bucket: serialize(newBucket),
          })
        } catch (error) {
          console.warn("update error", error)

          // if something goes wrong during the update,
          // just return the current bucket
          return json({
            user,
            bucket: serialize(bucket),
            errorMessage: "oops, something went wrong. try again",
          })
        }
      })
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
          {bucket.columns.map((column) => (
            <ColumnCard key={column.id} pending={column.id === deletedColumnId}>
              <div className="p-3">
                <ColumnHeader
                  title={column.name}
                  right={<DeleteColumnButton bucket={bucket} column={column} />}
                />
              </div>

              <div className="grid items-start content-start flex-1 min-h-0 gap-3 px-3 pb-3 overflow-y-auto transform-gpu">
                <ThoughtCard />
                <ThoughtCard />
                <ThoughtCard />
              </div>
            </ColumnCard>
          ))}

          {newColumnName && (
            <ColumnCard pending>
              <div className="p-3">
                <ColumnHeader title={newColumnName} />
              </div>
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

function ColumnCard({
  children,
  pending,
}: {
  children: ReactNode
  pending?: boolean
}) {
  return (
    <div
      className={clsx(
        cardClass,
        "flex flex-col transition-opacity",
        pending && "opacity-50",
      )}
    >
      {children}
    </div>
  )
}
