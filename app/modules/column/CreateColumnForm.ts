import { z } from "zod"
import { createFormHelpers } from "~/modules/remix/form"

export const CreateColumnForm = createFormHelpers(
  z.object({
    bucketId: z.string(),
    name: z.string().nonempty("column name cannot be empty"),
  }),
)

export type CreateColumnOutput = z.output<typeof CreateColumnForm["schema"]>
