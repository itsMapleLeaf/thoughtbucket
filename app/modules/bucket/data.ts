import { UpdateBucketForm } from "~/modules/bucket/UpdateBucketForm"
import { getClient } from "~/modules/db"

export async function updateBucket(bucketId: string, request: Request) {
  const body = await UpdateBucketForm.getBody(request)

  const db = getClient()

  await db.bucket.update({
    where: { id: bucketId },
    data: {
      name: body.name,
    },
  })
}
