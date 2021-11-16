import type { DataFunctionArgs } from "@remix-run/server-runtime"
import type { MetaFunction } from "remix"
import { Form, Link } from "remix"
import { z } from "zod"
import { getAppMeta } from "~/modules/app/getAppMeta"
import { sessionHelpers } from "~/modules/auth/session"
import { raise } from "~/modules/common/helpers"
import { httpCodes } from "~/modules/network/http-codes"
import { catchErrorResponse } from "~/modules/remix/catchErrorResponse"
import { redirectTyped, useActionDataTyped } from "~/modules/remix/data"
import { errorResponse } from "~/modules/remix/error-response"
import { createFormHelpers } from "~/modules/remix/form"
import { FormSubmitButton } from "~/modules/remix/FormSubmitButton"
import { anchorClass } from "~/modules/ui/anchor"
import { solidButtonClass } from "~/modules/ui/button"
import { TextInputField } from "~/modules/ui/TextInputField"
import { loginUser } from "~/modules/user"
import AuthPageLayout from "~/routes/__auth"

const { getBody, Field } = createFormHelpers(
  z.object({
    email: z.string().email(`email is invalid`),
    password: z.string(),
  }),
)

export const meta: MetaFunction = () => getAppMeta("log in")

export async function action({ request }: DataFunctionArgs) {
  return catchErrorResponse(async () => {
    const body = await getBody(request)

    const user =
      (await loginUser(body)) ??
      raise(errorResponse("invalid email or password", httpCodes.unauthorized))

    const { responseHeaders } = await sessionHelpers(request).create(user)

    return redirectTyped("/buckets", {
      status: httpCodes.seeOther,
      headers: responseHeaders,
    })
  })
}

export default function LoginPage() {
  const { errorMessage } = useActionDataTyped<typeof action>() ?? {}

  return (
    <>
      <h1 className={AuthPageLayout.titleClass}>log in</h1>

      <Form method="post" className={AuthPageLayout.formClass}>
        <Field as={TextInputField.Email} name="email" required />
        <Field
          as={TextInputField.Password}
          name="password"
          required
          isNewPassword={false}
        />
        <FormSubmitButton className={solidButtonClass}>log in</FormSubmitButton>
      </Form>

      {errorMessage ? (
        <AuthPageLayout.Paragraph className="text-red-400">
          error: {errorMessage}
        </AuthPageLayout.Paragraph>
      ) : null}

      <AuthPageLayout.Paragraph>
        {"don't have an account? "}
        <Link to="/signup" className={anchorClass}>
          sign up
        </Link>
      </AuthPageLayout.Paragraph>
    </>
  )
}
