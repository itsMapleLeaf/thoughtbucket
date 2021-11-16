import { z } from "zod"
import { createFormHelpers } from "~/modules/remix/form"

export const UpdateBucketForm = createFormHelpers(
  z.object({
    name: z.string(),
  }),
)
