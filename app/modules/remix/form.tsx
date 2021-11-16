import type { ComponentPropsWithoutRef, ComponentType } from "react"
import { useFetcher } from "remix"
import type { ZodType, ZodTypeDef } from "zod"
import { getRequestBody } from "~/modules/common/getRequestBody"
import { httpCodes } from "~/modules/network/http-codes"
import { errorResponse } from "~/modules/remix/error-response"
import { flattenZodErrorIssues } from "../common/flattenZodErrorIssues"

export function createFormHelpers<Input extends Record<string, string>, Output>(
  schema: ZodType<Output, ZodTypeDef, Input>,
) {
  return {
    schema,

    getBody: async (request: Request) => {
      const result = schema.safeParse(await getRequestBody(request))

      if (!result.success) {
        throw errorResponse(
          flattenZodErrorIssues(result.error),
          httpCodes.badRequest,
        )
      }

      return result.data
    },

    Field: <
      AsProps extends { name?: string } = ComponentPropsWithoutRef<"input">,
    >({
      as: Component,
      ...props
    }: { name: keyof Input; as?: ComponentType<AsProps> } & AsProps) => {
      if (Component) {
        // @ts-expect-error: don't know how to fix this type error
        return <Component {...props} />
      }
      return <input {...props} />
    },

    useFetcher() {
      const fetcher = useFetcher()
      return {
        ...fetcher,
        submit(body: Input) {
          fetcher.submit(body)
        },
      }
    },
  }
}
