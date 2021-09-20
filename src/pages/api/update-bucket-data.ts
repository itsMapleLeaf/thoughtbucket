import type { NextApiHandler } from "next"
import { z } from "zod"
import { getClient } from "../../db/client"
import { createSessionHelpers } from "../../db/session"
import { bucketDataSchema } from "../../modules/bucket/BucketData"

const bodySchema = z.object({
  bucketId: z.string(),
  data: bucketDataSchema,
})

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "PUT") {
    res.status(405).end("Method not allowed")
    return
  }

  const db = getClient()
  const body = bodySchema.parse(req.body)
  const user = await createSessionHelpers({ req, res }).getUser()

  const bucket = await db.bucket.findUnique({
    where: {
      id: body.bucketId,
    },
  })

  if (!bucket) {
    res.status(404).json({ errorMessage: "couldn't find that bucket" })
    return
  }

  if (bucket.ownerId !== user?.id) {
    res.status(403).json({ errorMessage: "you don't own this bucket. stop" })
    return
  }

  await db.bucket.update({
    where: {
      id: body.bucketId,
    },
    data: {
      data: JSON.stringify(body.data),
    },
  })

  res.status(200).json({ success: true })
}
export default handler
