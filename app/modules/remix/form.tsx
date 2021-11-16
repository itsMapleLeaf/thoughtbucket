import type { ComponentProps, ElementType } from "react"
import type { JsonValue } from "type-fest"
import type { ZodType, ZodTypeDef } from "zod"
import { getRequestBody } from "~/modules/common/getRequestBody"
import { responseTyped } from "~/modules/remix/data"
import { errorResponse } from "~/modules/remix/error-response"
import { flattenZodErrorIssues } from "../common/flattenZodErrorIssues"

type InputProps = ComponentProps<"input">

export function createFormHelpers<Input extends JsonValue, Output>(
  schema: ZodType<Output, ZodTypeDef, Input>,
) {
  return {
    getBody: async (request: Request) => {
      const result = schema.safeParse(await getRequestBody(request))

      if (result.success) {
        return [result.data, responseTyped<never>()] as const
      }

      const errorMessage = flattenZodErrorIssues<Input>(result.error)
      return [undefined, errorResponse(errorMessage)] as const
    },

    Field: <Props extends InputProps>({
      // @ts-expect-error typescript is not nice here
      as: Component = "input",
      ...props
    }: Props & { name: keyof Input; as?: ElementType<Props> }) => {
      // @ts-expect-error typescript is not nice here
      return <Component {...props} />
    },
  }
}
