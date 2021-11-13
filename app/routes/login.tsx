import type { ActionFunction, LoaderFunction, MetaFunction } from "remix"
import { Form, json, Link, redirect, useActionData, useTransition } from "remix"
import { z } from "zod"
import { getAppMeta } from "~/modules/app/getAppMeta"
import { AuthPageLayout } from "~/modules/auth/AuthPageLayout"
import { sessionHelpers } from "~/modules/auth/session"
import { Button } from "~/modules/dom/Button"
import { createFormHelpers } from "~/modules/form"
import { httpCodes } from "~/modules/network/http-codes"
import { anchorClass } from "~/modules/ui/anchor"
import { solidButtonClass } from "~/modules/ui/button"
import { TextInputField } from "~/modules/ui/TextInputField"
import { loginUser } from "~/modules/user"

type ActionData = {
  errorMessage?: string
}

const { getBody, Field } = createFormHelpers(
  z.object({
    email: z.string().email(`email is invalid`),
    password: z.string(),
  }),
)

export const meta: MetaFunction = () => getAppMeta("login")

export const loader: LoaderFunction = async ({ request }) => {
  const user = await sessionHelpers(request).getUser()
  return user ? redirect("/buckets") : new Response()
}

export const action: ActionFunction = async ({ request }) => {
  const [body, bodyError] = await getBody(request)
  if (!body) return bodyError

  const user = await loginUser(body)
  if (!user) {
    return json(
      { errorMessage: "invalid email or password" },
      httpCodes.unauthorized,
    )
  }

  const { responseHeaders } = await sessionHelpers(request).create(user)

  return redirect("/buckets", {
    status: httpCodes.seeOther,
    headers: responseHeaders,
  })
}

export default function LoginPage() {
  const transition = useTransition()
  const { errorMessage } = useActionData<{ errorMessage?: string }>() ?? {}

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
        <Button
          className={solidButtonClass}
          type="submit"
          loading={transition.state !== "idle"}
        >
          log in
        </Button>
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
