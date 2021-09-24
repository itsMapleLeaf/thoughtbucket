import { handle, json, redirect } from "next-runtime"
import { Form, useFormSubmit } from "next-runtime/form"
import { FetchError } from "next-runtime/lib/fetch-error"
import Link from "next/link"
import { z } from "zod"
import { createSessionHelpers } from "../db/session"
import { loginUser } from "../db/user"
import { httpCodes } from "../http-codes"
import { AuthPageLayout } from "../modules/auth/AuthPageLayout"
import { Button } from "../modules/dom/Button"
import { anchorClass } from "../modules/ui/anchor"
import { solidButtonClass } from "../modules/ui/button"
import { TextInputField } from "../modules/ui/TextInputField"

type Response = {
  errorMessage?: string
}

const loginBodySchema = z.object({
  email: z.string().email(`Must be a valid email`),
  password: z.string(),
})

export const getServerSideProps = handle<Response>({
  async get(context) {
    const user = await createSessionHelpers(context).getUser()
    return user ? redirect("/buckets") : json({})
  },

  async post(context) {
    const body = loginBodySchema.parse(context.req.body)
    const user = await loginUser(body)
    if (!user) {
      return json(
        { errorMessage: "Invalid email or password" },
        httpCodes.unauthorized,
      )
    }

    await createSessionHelpers(context).createSession(user)
    return redirect("/buckets", httpCodes.seeOther)
  },
})

export default function LoginPage() {
  const submit = useFormSubmit()

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
          loading={submit.isLoading}
        >
          log in
        </Button>
      </Form>

      {submit.error instanceof FetchError ? (
        <AuthPageLayout.Paragraph>
          {submit.error.data?.errorMessage as string}
        </AuthPageLayout.Paragraph>
      ) : null}

      <AuthPageLayout.Paragraph>
        {"don't have an account? "}
        <Link href="/signup">
          <a className={anchorClass}>sign up</a>
        </Link>
      </AuthPageLayout.Paragraph>
    </AuthPageLayout>
  )
}
