import { z } from "zod"
import { columnListSchema } from "~/modules/column/Column"
import { createFormHelpers } from "~/modules/remix/form"

export const CreateBucketForm = createFormHelpers(
  z.object({
    name: z.string(),
  }),
)

export type EditBucketBody = z.TypeOf<typeof editBucketBodySchema>
const editBucketBodySchema = z.object({
  name: z.string().optional(),
  columns: columnListSchema.optional(),
})
export const EditBucketForm = createFormHelpers(editBucketBodySchema)
