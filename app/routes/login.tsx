import type { DataFunctionArgs } from "@remix-run/server-runtime"
import type { MetaFunction } from "remix"
import { Form, Link, redirect } from "remix"
import { z } from "zod"
import { getAppMeta } from "~/modules/app/getAppMeta"
import { AuthPageLayout } from "~/modules/auth/AuthPageLayout"
import { sessionHelpers } from "~/modules/auth/session"
import { httpCodes } from "~/modules/network/http-codes"
import { redirectTyped, useActionDataTyped } from "~/modules/remix/data"
import { errorResponse } from "~/modules/remix/error-response"
import { createFormHelpers } from "~/modules/remix/form"
import { FormSubmitButton } from "~/modules/remix/FormSubmitButton"
import { anchorClass } from "~/modules/ui/anchor"
import { solidButtonClass } from "~/modules/ui/button"
import { TextInputField } from "~/modules/ui/TextInputField"
import { loginUser } from "~/modules/user"

const { getBody, Field } = createFormHelpers(
  z.object({
    email: z.string().email(`email is invalid`),
    password: z.string(),
  }),
)

export const meta: MetaFunction = () => getAppMeta("log in")

export async function loader({ request }: DataFunctionArgs) {
  const user = await sessionHelpers(request).getUser()
  return user ? redirect("/buckets") : new Response()
}

export async function action({ request }: DataFunctionArgs) {
  const [body, bodyError] = await getBody(request)
  if (!body) return bodyError

  const user = await loginUser(body)
  if (!user) {
    return errorResponse("invalid email or password", httpCodes.unauthorized)
  }

  const { responseHeaders } = await sessionHelpers(request).create(user)

  return redirectTyped("/buckets", {
    status: httpCodes.seeOther,
    headers: responseHeaders,
  })
}

export default function LoginPage() {
  const { errorMessage } = useActionDataTyped<typeof action>() ?? {}

  return (
    <AuthPageLayout title="log in">
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
    </AuthPageLayout>
  )
}
