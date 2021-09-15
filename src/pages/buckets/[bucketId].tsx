import { PencilAltIcon, TrashIcon } from "@heroicons/react/solid"
import { Bucket, Column, User } from "@prisma/client"
import { GetServerSideProps } from "next"
import { useRef } from "react"
import { getClient } from "../../db/client"
import { createSessionHelpers } from "../../db/session"
import { pick, serialize, Serialized } from "../../helpers"
import { AppLayout } from "../../modules/app/AppLayout"
import { BucketPageSummary } from "../../modules/bucket/BucketPageSummary"
import { ColumnHeader } from "../../modules/column/ColumnHeader"
import { NewColumnForm } from "../../modules/column/NewColumnForm"
import { Button } from "../../modules/dom/Button"
import { ThoughtCard } from "../../modules/thought/ThoughtCard"
import { fadedButtonClass } from "../../modules/ui/button"
import { containerClass } from "../../modules/ui/container"
import { leftButtonIconClass } from "../../modules/ui/icon"

const db = getClient()

type Props = {
  user: Pick<User, "name">
  bucket: Serialized<Pick<Bucket, "name" | "createdAt">>
  columns: Pick<Column, "name" | "id">[]
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const user = await createSessionHelpers(context).getUser()
  if (!user) {
    return {
      redirect: { destination: "/login", permanent: false },
    }
  }

  const id = context.params?.bucketId
  if (!id) {
    return { notFound: true }
  }

  const bucket = await db.bucket.findUnique({
    where: {
      id: String(id),
    },
    select: {
      name: true,
      createdAt: true,
    },
  })

  if (!bucket) {
    return { notFound: true }
  }

  const columns = await db.column.findMany({
    where: {
      bucketId: String(id),
    },
    select: {
      id: true,
      name: true,
    },
  })

  return {
    props: {
      user: pick(user, ["name"]),
      bucket: serialize(bucket),
      columns,
    },
  }
}

export default function BucketPage({ user, bucket, columns }: Props) {
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
            <Button className={fadedButtonClass}>
              <TrashIcon className={leftButtonIconClass} /> delete
            </Button>
          </div>
        </section>

        <section
          className="grid grid-flow-col gap-4 p-4 auto-cols-[18rem] grid-rows-1 mx-auto min-w-[min(1024px,100%)] max-w-full overflow-auto flex-1"
          ref={columnScrollContainerRef}
        >
          {columns.map((column) => (
            <div
              key={column.id}
              className="flex flex-col p-3 bg-gray-900 rounded-md shadow-inner"
            >
              <div className="mb-3">
                <ColumnHeader title={column.name} />
              </div>

              <div className="grid items-start content-start flex-1 min-h-0 gap-3 overflow-y-auto transform-gpu">
                <ThoughtCard />
                <ThoughtCard />
                <ThoughtCard />
                <ThoughtCard />
                <ThoughtCard />
                <ThoughtCard />
                <ThoughtCard />
                <ThoughtCard />
                <ThoughtCard />
                <ThoughtCard />
                <ThoughtCard />
                <ThoughtCard />
              </div>
            </div>
          ))}

          <div>
            <NewColumnForm />
          </div>
        </section>
      </div>
    </AppLayout>
  )
}
