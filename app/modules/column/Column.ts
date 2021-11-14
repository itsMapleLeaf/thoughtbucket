import { z } from "zod"

export type Column = z.TypeOf<typeof columnSchema>

export const columnSchema = z.object({
  id: z.string(),
  name: z.string(),
  thoughts: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
    }),
  ),
})

export const columnListSchema = z.array(columnSchema)
