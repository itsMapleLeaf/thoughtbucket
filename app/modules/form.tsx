import type { ComponentProps, ElementType } from "react"
import { json } from "remix"
import type { ZodType } from "zod"
import { getRequestBody } from "~/modules/common/getRequestBody"

type InputProps = ComponentProps<"input">

export function createFormHelpers<T extends Record<string, string>>(
  schema: ZodType<T>,
) {
  return {
    getBody: async (request: Request) => {
      const body = await getRequestBody(request)
      const result = schema.safeParse(body)

      if (result.success) {
        return [result.data, new Response()] as const
      }

      const errorMessage = result.error.issues
        .map((issue) => issue.message)
        .join("\n")

      return [undefined, json({ errorMessage }, 400)] as const
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
