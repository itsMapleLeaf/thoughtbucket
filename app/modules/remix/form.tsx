import type { ComponentProps, ElementType } from "react"
import type { ZodType } from "zod"
import { getRequestBody } from "~/modules/common/getRequestBody"
import { jsonTyped, responseTyped } from "~/modules/remix/data"

type InputProps = ComponentProps<"input">

export function createFormHelpers<T extends Record<string, string>>(
  schema: ZodType<T>,
) {
  return {
    getBody: async (request: Request) => {
      const body = await getRequestBody(request)
      const result = schema.safeParse(body)

      if (result.success) {
        return [result.data, responseTyped<never>()] as const
      }

      const errorMessage = result.error.issues
        .map((issue) => issue.message)
        .join("\n")

      return [undefined, jsonTyped({ errorMessage }, 400)] as const
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
