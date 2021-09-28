import type { Bucket, User } from "@prisma/client"
import clsx from "clsx"
import { handle, json, redirect } from "next-runtime"
import { z } from "zod"
import { getClient } from "../../modules/db"
import { AppLayout } from "../../modules/app/AppLayout"
import { sessionHelpers } from "../../modules/auth/session"
import { BucketSummaryCard } from "../../modules/bucket/BucketSummaryCard"
import { pick } from "../../modules/common/helpers"
import { containerClass } from "../../modules/ui/container"

const db = getClient()

const postBodySchema = z.object({
  name: z.string(),
})

type Props = {
  user?: Pick<User, "name">
  buckets?: Array<Pick<Bucket, "name" | "id">>
  newBucket?: Pick<Bucket, "id">
  errorMessage?: string
}

export const getServerSideProps = handle<Props>({
  get: async (context) => {
    const user = await sessionHelpers(context).getUser()
    if (!user) {
      return redirect("/login")
    }

    const buckets = await db.bucket.findMany({
      where: {
        ownerId: user.id,
      },
      select: {
        id: true,
        name: true,
      },
    })

    return json({
      user: pick(user, ["name"]),
      buckets,
    })
  },

  post: async (context) => {
    const result = postBodySchema.safeParse(context.req.body)
    if (!result.success) {
      const message = result.error.issues
        .map((issue) => issue.message)
        .join(", ")
      return json({
        errorMessage: message,
      })
    }

    const user = await sessionHelpers(context).getUser()
    if (!user) {
      return json({
        errorMessage: "You must be logged in to create a bucket",
      })
    }

    const bucket = await db.bucket.create({
      data: {
        name: result.data.name,
        ownerId: user.id,
        columns: [],
      },
      select: {
        id: true,
      },
    })

    return redirect(`/buckets/${bucket.id}`, 303)
  },
})

export default function BucketListPage(props: Props) {
  return (
    <AppLayout user={props.user}>
      <div
        className={clsx(
          containerClass,
          "grid gap-4 grid-cols-[repeat(auto-fill,minmax(14rem,1fr))]",
        )}
      >
        {props.buckets?.map((bucket) => (
          <BucketSummaryCard key={bucket.id} bucket={bucket} />
        ))}
      </div>
    </AppLayout>
  )
}
