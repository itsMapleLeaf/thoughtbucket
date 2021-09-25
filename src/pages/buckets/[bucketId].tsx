import { PencilAltIcon, TrashIcon } from "@heroicons/react/solid"
import type { User } from "@prisma/client"
import produce from "immer"
import { nanoid } from "nanoid"
import { handle, json, notFound, redirect } from "next-runtime"
import { useMemo, useRef, useState } from "react"
import { z } from "zod"
import { getClient } from "../../db/client"
import { createSessionHelpers } from "../../db/session"
import { pick } from "../../helpers"
import { httpCodes } from "../../http-codes"
import { AppLayout } from "../../modules/app/AppLayout"
import { BucketPageSummary } from "../../modules/bucket/BucketPageSummary"
import type { ClientBucket } from "../../modules/bucket/ClientBucket"
import { asClientBucket } from "../../modules/bucket/ClientBucket"
import { DeleteBucketButton } from "../../modules/bucket/DeleteBucketButton"
import { usingBucket } from "../../modules/bucket/usingBucket"
import { usingOwnedBucket } from "../../modules/bucket/usingOwnedBucket"
import { ColumnCard } from "../../modules/column/ColumnCard"
import { Button } from "../../modules/dom/Button"
import { fetchJsonWithRetry } from "../../modules/network/fetchWithRetry"
import { getContextParam } from "../../modules/routing/getContextParam"
import { useObservable } from "../../modules/rxjs/useObservable"
import { ThoughtCard } from "../../modules/thought/ThoughtCard"
import { fadedButtonClass } from "../../modules/ui/button"
import { containerClass } from "../../modules/ui/container"
import { leftButtonIconClass } from "../../modules/ui/icon"
import { QuickInsertForm } from "../../modules/ui/QuickInsertForm"

type BucketColumn = z.TypeOf<typeof bucketColumnSchema>
const bucketColumnSchema = z.object({
  id: z.string(),
  name: z.string(),
  thoughts: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
    }),
  ),
})

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

  const createColumn = (name: string) =>
    setColumns((columns) => [...columns, { id: nanoid(), name, thoughts: [] }])

  const deleteColumn = (id: string) =>
    setColumns((columns) => columns.filter((c) => c.id !== id))

  const createThought = (args: { columnId: string; text: string }) =>
    setColumns(
      produce((draft) => {
        const column = draft.find((c) => c.id === args.columnId)
        column?.thoughts.unshift({ id: nanoid(), text: args.text })
      }),
    )

  const deleteThought = (args: { columnId: string; thoughtId: string }) =>
    setColumns(
      produce((draft) => {
        const column = draft.find((c) => c.id === args.columnId)
        if (column) {
          column.thoughts = column.thoughts.filter(
            (t) => t.id !== args.thoughtId,
          )
        }
      }),
    )

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
          {columns.map((column) => (
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
