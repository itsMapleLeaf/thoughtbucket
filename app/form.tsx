import { ComponentPropsWithoutRef } from "react"
import { ZodType } from "zod"

export function createFormModule<Values extends Record<string, string>>(
  validateBody: (bodyObject: Record<string, string>) => Values,
) {
  return {
    Input(props: ComponentPropsWithoutRef<"input"> & { name: keyof Values }) {
      return <input {...props} />
    },

    async getBody(request: Request): Promise<Values> {
      return validateBody(
        Object.fromEntries(new URLSearchParams(await request.clone().text())),
      )
    },
  }
}

export function createFormModuleWithSchema<
  Values extends Record<string, string>,
>(schema: ZodType<Values>) {
  return createFormModule((body) => schema.parse(body))
}
