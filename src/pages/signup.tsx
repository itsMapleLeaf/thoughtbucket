import { handle, json, redirect } from "next-runtime"
import { Form } from "next-runtime/form"
import Link from "next/link"
import { useRouter } from "next/router"
import { z } from "zod"
import { createSessionHelpers } from "../db/session"
import { createUser } from "../db/user"
import { AuthPageLayout } from "../modules/auth/AuthPageLayout"
import { Button } from "../modules/dom/Button"
import { solidButtonClass } from "../modules/ui/button"
import { TextInputField } from "../modules/ui/TextInputField"

const signupBodySchema = z.object({
  name: z.string(),
  email: z.string().email(`Please enter a valid email`),
  password: z.string().min(8, `Password must be at least 8 characters long`),
})

export const getServerSideProps = handle({
  async get(context) {
    const user = await createSessionHelpers(context).getUser()
    return user ? redirect("/") : json({})
  },

  async post(context) {
    const body = signupBodySchema.safeParse(context.req.body)
    if (!body.success) {
      const message = body.error.issues.map((error) => error.message).join("\n")
      return redirect(`/signup?error=${message}`)
    }

    const user = await createUser(body.data)

    const session = createSessionHelpers(context)
    await session.createSession(user)

    return redirect("/")
  },
})

export default function SignupPage() {
  const { query } = useRouter()
  return (
    <AuthPageLayout title="sign up">
      <Form
        // @ts-expect-error
        className={AuthPageLayout.formClass}
        method="post"
      >
        <TextInputField.Username name="name" required />
        <TextInputField.Email name="email" required />
        <TextInputField.Password
          name="password"
          isNewPassword
          required
          pattern=".{8,}"
          title="Must be at least 8 characters long"
        />
        <Button className={solidButtonClass} type="submit">
          sign up
        </Button>
      </Form>

      {query.error && (
        <AuthPageLayout.Paragraph>{query.error}</AuthPageLayout.Paragraph>
      )}

      <AuthPageLayout.Paragraph>
        already have an account?{" "}
        <Link href="/login" passHref>
          <AuthPageLayout.Anchor>log in</AuthPageLayout.Anchor>
        </Link>
      </AuthPageLayout.Paragraph>
    </AuthPageLayout>
  )
}
