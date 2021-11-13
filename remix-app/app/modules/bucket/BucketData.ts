import { z } from "zod"

export type BucketData = z.TypeOf<typeof bucketDataSchema>

export const bucketDataSchema = z.object({
  columns: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      thoughts: z.array(
        z.object({
          id: z.string(),
          text: z.string(),
        }),
      ),
    }),
  ),
})
