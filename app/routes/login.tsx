import type { ActionFunction, LoaderFunction, MetaFunction } from "remix"
import { Form, json, Link, redirect, useActionData, useTransition } from "remix"
import { z } from "zod"
import { getAppMeta } from "~/modules/app/getAppMeta"
import { AuthPageLayout } from "~/modules/auth/AuthPageLayout"
import { sessionHelpers } from "~/modules/auth/session"
import { getRequestBody } from "~/modules/common/getRequestBody"
import { Button } from "~/modules/dom/Button"
import { httpCodes } from "~/modules/network/http-codes"
import { anchorClass } from "~/modules/ui/anchor"
import { solidButtonClass } from "~/modules/ui/button"
import { TextInputField } from "~/modules/ui/TextInputField"
import { loginUser } from "~/modules/user"

type ActionData = {
  errorMessage?: string
}

const loginBodySchema = z.object({
  email: z.string().email(`Must be a valid email`),
  password: z.string(),
})

export const meta: MetaFunction = () => getAppMeta("login")

export const loader: LoaderFunction = async ({ request }) => {
  const user = await sessionHelpers(request).getUser()
  return user ? redirect("/buckets") : new Response()
}

export const action: ActionFunction = async ({ request }) => {
  const body = loginBodySchema.parse(await getRequestBody(request))
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
  const data = useActionData<ActionData>()
  const transition = useTransition()

  return (
    <AuthPageLayout title="log in">
      <Form method="post" className={AuthPageLayout.formClass}>
        <TextInputField.Email name="email" required />
        <TextInputField.Password
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

      {data?.errorMessage ? (
        <AuthPageLayout.Paragraph>{data.errorMessage}</AuthPageLayout.Paragraph>
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
