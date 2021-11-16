import { z } from "zod"
import { createFormHelpers } from "~/modules/remix/form"

export const CreateBucketForm = createFormHelpers(
  z.object({
    name: z.string(),
  }),
)
