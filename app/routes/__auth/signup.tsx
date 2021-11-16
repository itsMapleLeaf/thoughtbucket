import type { DataFunctionArgs } from "@remix-run/server-runtime"
import { Form, Link } from "remix"
import { z } from "zod"
import { getAppMeta } from "~/modules/app/getAppMeta"
import { sessionHelpers } from "~/modules/auth/session"
import { httpCodes } from "~/modules/network/http-codes"
import { catchErrorResponse } from "~/modules/remix/catchErrorResponse"
import { redirectTyped, useActionDataTyped } from "~/modules/remix/data"
import { createFormHelpers } from "~/modules/remix/form"
import { FormSubmitButton } from "~/modules/remix/FormSubmitButton"
import { anchorClass } from "~/modules/ui/anchor"
import { solidButtonClass } from "~/modules/ui/button"
import { TextInputField } from "~/modules/ui/TextInputField"
import { createUser } from "~/modules/user"
import AuthPageLayout from "~/routes/__auth"

const { getBody, Field } = createFormHelpers(
  z.object({
    name: z.string(),
    email: z.string().email(`Please enter a valid email`),
    password: z.string().min(8, `Password must be at least 8 characters long`),
  }),
)

export const meta = () => getAppMeta("sign up")

export async function action({ request }: DataFunctionArgs) {
  return catchErrorResponse(async () => {
    const body = await getBody(request)
    const user = await createUser(body)
    const { responseHeaders } = await sessionHelpers(request).create(user)

    return redirectTyped("/buckets", {
      status: httpCodes.seeOther,
      headers: responseHeaders,
    })
  })
}

export default function SignupPage() {
  const { errorMessage } = useActionDataTyped<typeof action>() ?? {}

  return (
    <>
      <h1 className={AuthPageLayout.titleClass}>sign up</h1>

      <Form className={AuthPageLayout.formClass} method="post">
        <Field as={TextInputField.Username} name="name" required />
        <Field as={TextInputField.Email} name="email" required />
        <Field
          as={TextInputField.Password}
          name="password"
          isNewPassword
          required
          pattern=".{8,}"
          title="Must be at least 8 characters long"
        />
        <FormSubmitButton className={solidButtonClass}>
          sign up
        </FormSubmitButton>
      </Form>

      {errorMessage && (
        <AuthPageLayout.Paragraph>{errorMessage}</AuthPageLayout.Paragraph>
      )}

      <AuthPageLayout.Paragraph>
        already have an account?{" "}
        <Link to="/login" className={anchorClass}>
          log in
        </Link>
      </AuthPageLayout.Paragraph>
    </>
  )
}
