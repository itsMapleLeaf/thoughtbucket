import { PencilAltIcon, TrashIcon } from "@heroicons/react/solid"
import type { User } from "@prisma/client"
import type { Draft } from "immer"
import produce from "immer"
import { nanoid } from "nanoid"
import { handle, json, redirect } from "next-runtime"
import { useMemo, useRef, useState } from "react"
import { z } from "zod"
import { getClient } from "../../db/client"
import { pick } from "../../helpers"
import { AppLayout } from "../../modules/app/AppLayout"
import { usingSessionUser } from "../../modules/auth/usingSessionUser"
import type { BucketData } from "../../modules/bucket/BucketData"
import { bucketDataSchema } from "../../modules/bucket/BucketData"
import { BucketPageSummary } from "../../modules/bucket/BucketPageSummary"
import type { ClientBucket } from "../../modules/bucket/ClientBucket"
import { asClientBucket } from "../../modules/bucket/ClientBucket"
import { DeleteBucketButton } from "../../modules/bucket/DeleteBucketButton"
import { usingBucket } from "../../modules/bucket/usingBucket"
import { usingOwnedBucket } from "../../modules/bucket/usingOwnedBucket"
import { ColumnCard } from "../../modules/column/ColumnCard"
import { Button } from "../../modules/dom/Button"
import { fetchWithRetry } from "../../modules/network/fetchWithRetry"
import { getContextParam } from "../../modules/routing/getContextParam"
import { useObservable } from "../../modules/rxjs/useObservable"
import { ThoughtCard } from "../../modules/thought/ThoughtCard"
import { fadedButtonClass } from "../../modules/ui/button"
import { containerClass } from "../../modules/ui/container"
import { leftButtonIconClass } from "../../modules/ui/icon"
import { QuickInsertForm } from "../../modules/ui/QuickInsertForm"

type Props = {
  user: Pick<User, "name">
  bucket: ClientBucket
  bucketData: BucketData
  errorMessage?: string
}

export const getServerSideProps = handle<Props>({
  get: async (context) => {
    return usingSessionUser(context, (user) => {
      const bucketId = getContextParam(context, "bucketId")
      return usingBucket(bucketId, (bucket) => {
        return json<Props>({
          user: pick(user, ["name"]),
          bucket: asClientBucket(bucket),
          bucketData: bucketDataSchema.parse(JSON.parse(bucket.data)),
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

    const patchBodySchema = z
      .object({
        name: z.string(),
        data: bucketDataSchema,
      })
      .partial()

    const body = patchBodySchema.parse(context.req.body)

    return usingOwnedBucket(context, bucketId, async (user) => {
      await db.bucket.update({
        where: { id: bucketId },
        data: {
          ...body,
          data: body.data ? JSON.stringify(body.data) : undefined,
        },
      })

      return redirect(context.req.url!, 303)
    })
  },
})

export default function BucketPage({
  user,
  bucket,
  bucketData: initialBucketData,
}: Props) {
  const [bucketData, setBucketData] = useState(initialBucketData)

  const createColumn = (name: string) =>
    setBucketData(
      produce((draft) => {
        draft.columns.push({
          id: nanoid(),
          name,
          thoughts: [],
        })
      }),
    )

  const deleteColumn = (id: string) =>
    setBucketData(
      produce((draft) => {
        draft.columns = draft.columns.filter((c) => c.id !== id)
      }),
    )

  const createThought = (args: { columnId: string; text: string }) =>
    setBucketData(
      produce((draft) => {
        const column = draft.columns.find((c) => c.id === args.columnId)
        column?.thoughts.unshift({ id: nanoid(), text: args.text })
      }),
    )

  const deleteThought = (args: { columnId: string; thoughtId: string }) =>
    setBucketData(
      produce((draft: Draft<BucketData>) => {
        const column = draft.columns.find((c) => c.id === args.columnId)
        if (column) {
          column.thoughts = column.thoughts.filter(
            (t) => t.id !== args.thoughtId,
          )
        }
      }),
    )

  const fetchState = useObservable(
    useMemo(() => {
      if (bucketData === initialBucketData) return

      return fetchWithRetry(`/buckets/${bucket.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: bucketData,
        }),
      })
    }, [bucket.id, bucketData, initialBucketData]),
    { status: "init" as const },
  )

  const columnScrollContainerRef = useRef<HTMLDivElement>(null)

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

        <pre>{fetchState.status === "error" && fetchState.error.message}</pre>

        <section
          className="grid grid-flow-col gap-4 p-4 auto-cols-[18rem] grid-rows-1 mx-auto min-w-[min(1024px,100%)] max-w-full overflow-auto flex-1"
          ref={columnScrollContainerRef}
        >
          {bucketData.columns.map((column) => (
            <ColumnCard key={column.id}>
              <ColumnCard.Header
                title={column.name}
                right={
                  <Button
                    className={fadedButtonClass}
                    title="delete this column"
                    onClick={() => deleteColumn(column.id)}
                  >
                    <TrashIcon className={leftButtonIconClass} />
                  </Button>
                }
              />
              <ColumnCard.Section>
                <QuickInsertForm
                  onSubmit={(text) =>
                    createThought({ columnId: column.id, text })
                  }
                >
                  <QuickInsertForm.Input
                    placeholder="add a new thought..."
                    label="thought text"
                  />
                  <QuickInsertForm.Button title="add thought" />
                </QuickInsertForm>
              </ColumnCard.Section>
              <ColumnCard.CardList>
                {column.thoughts.map((thought) => (
                  <li key={thought.id}>
                    <ThoughtCard
                      thought={thought}
                      onDelete={() =>
                        deleteThought({
                          columnId: column.id,
                          thoughtId: thought.id,
                        })
                      }
                    />
                  </li>
                ))}
              </ColumnCard.CardList>
            </ColumnCard>
          ))}

          <div>
            <QuickInsertForm
              onSubmit={(name) => {
                createColumn(name.trim())
                requestAnimationFrame(() => {
                  columnScrollContainerRef.current?.scrollTo({
                    left: 0,
                    behavior: "smooth",
                  })
                })
              }}
            >
              <QuickInsertForm.Input
                name="createColumn.name"
                placeholder="add a new column..."
                label="column name"
              />
              <QuickInsertForm.Button title="add column" />
            </QuickInsertForm>
          </div>
        </section>
      </div>
    </AppLayout>
  )
}
