import type { ZodError } from "zod"

export function flattenZodErrorIssues<T>(error: ZodError<T>) {
  return error.issues.map((issue) => issue.message).join("\n")
}
