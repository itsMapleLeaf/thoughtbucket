import { User } from "@prisma/client"
import { handle, json, redirect } from "next-runtime"
import { z } from "zod"
import { getClient } from "../../db/client"
import { createSessionHelpers } from "../../db/session"
import { pick } from "../../helpers"
import { AppLayout } from "../../modules/app/AppLayout"

const db = getClient()

const bodySchema = z.object({
  name: z.string(),
})

type Props = {
  user?: Pick<User, "name">
  errorMessage?: string
}

export const getServerSideProps = handle<Props>({
  get: async (context) => {
    const user = await createSessionHelpers(context).getUser()
    return user ? json({ user: pick(user, ["name"]) }) : redirect("/login")
  },

  post: async (context) => {
    const body = bodySchema.parse(context.req.body)

    const user = await createSessionHelpers(context).getUser()
    if (!user) {
      return json({ errorMessage: "You must be logged in to create a bucket" })
    }

    const bucket = await db.bucket.create({
      data: {
        name: body.name,
        ownerId: user.id,
      },
    })

    return redirect(`/buckets/${bucket.id}`)
  },
})

export default function BucketListPage(props: Props) {
  return (
    <AppLayout user={props.user}>
      <p>h</p>
    </AppLayout>
  )
}
