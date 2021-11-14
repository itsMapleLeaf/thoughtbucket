import type { ComponentProps, ElementType } from "react"
import type { JsonValue } from "type-fest"
import type { ZodType } from "zod"
import { getRequestBody } from "~/modules/common/getRequestBody"
import { responseTyped } from "~/modules/remix/data"
import { errorResponse } from "~/modules/remix/error-response"

type InputProps = ComponentProps<"input">

export function createFormHelpers<T extends JsonValue>(schema: ZodType<T>) {
  return {
    getBody: async (request: Request) => {
      const result = schema.safeParse(await getRequestBody(request))

      if (result.success) {
        return [result.data, responseTyped<never>()] as const
      }

      const errorMessage = result.error.issues
        .map((issue) => issue.message)
        .join("\n")

      return [undefined, errorResponse(errorMessage)] as const
    },

    Field: <Props extends InputProps>({
      // @ts-expect-error typescript is not nice here
      as: Component = "input",
      ...props
    }: Props & { name: keyof T; as?: ElementType<Props> }) => {
      // @ts-expect-error typescript is not nice here
      return <Component {...props} />
    },
  }
}
