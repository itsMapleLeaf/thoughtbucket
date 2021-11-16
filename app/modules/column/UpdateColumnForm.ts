import { z } from "zod"
import { parsePositiveInteger } from "~/modules/common/parsePositiveInteger"
import { createFormHelpers } from "~/modules/remix/form"

export const UpdateColumnForm = createFormHelpers(
  z.object({
    name: z.string().nonempty("column name cannot be empty").optional(),
    order: z.string().transform(parsePositiveInteger).optional(),
  }),
)

export type UpdateColumnInput = z.input<typeof UpdateColumnForm["schema"]>
