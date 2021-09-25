import { z } from "zod"

export type BucketColumn = z.TypeOf<typeof bucketColumnSchema>

export const bucketColumnSchema = z.object({
  id: z.string(),
  name: z.string(),
  thoughts: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
    }),
  ),
})
