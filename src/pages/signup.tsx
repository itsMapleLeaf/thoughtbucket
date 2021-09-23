import { handle, json, redirect } from "next-runtime"
import { Form, useFormSubmit } from "next-runtime/form"
import Link from "next/link"
import { z } from "zod"
import { createSessionHelpers } from "../db/session"
import { createUser } from "../db/user"
import { AuthPageLayout } from "../modules/auth/AuthPageLayout"
import { Button } from "../modules/dom/Button"
import { anchorClass } from "../modules/ui/anchor"
import { solidButtonClass } from "../modules/ui/button"
import { TextInputField } from "../modules/ui/TextInputField"

type Props = {
  errorMessage?: string
}

const signupBodySchema = z.object({
  name: z.string(),
  email: z.string().email(`Please enter a valid email`),
  password: z.string().min(8, `Password must be at least 8 characters long`),
})

export const getServerSideProps = handle<Props>({
  async get(context) {
    const user = await createSessionHelpers(context).getUser()
    return user ? redirect("/buckets") : json({})
  },

  async post(context) {
    const body = signupBodySchema.safeParse(context.req.body)
    if (!body.success) {
      const message = body.error.issues.map((error) => error.message).join("\n")
      return json({ errorMessage: message })
    }

    const user = await createUser(body.data)

    const session = createSessionHelpers(context)
    await session.createSession(user)

    return redirect("/buckets", 303)
  },
})

export default function SignupPage(props: Props) {
  const { isLoading } = useFormSubmit("signup")
  return (
    <AuthPageLayout title="sign up">
      <Form name="signup" className={AuthPageLayout.formClass} method="post">
        <TextInputField.Username name="name" required />
        <TextInputField.Email name="email" required />
        <TextInputField.Password
          name="password"
          isNewPassword
          required
          pattern=".{8,}"
          title="Must be at least 8 characters long"
        />
        <Button className={solidButtonClass} type="submit" loading={isLoading}>
          sign up
        </Button>
      </Form>

      {props.errorMessage && (
        <AuthPageLayout.Paragraph>
          {props.errorMessage}
        </AuthPageLayout.Paragraph>
      )}

      <AuthPageLayout.Paragraph>
        already have an account?{" "}
        <Link href="/login">
          <a className={anchorClass}>log in</a>
        </Link>
      </AuthPageLayout.Paragraph>
    </AuthPageLayout>
  )
}
