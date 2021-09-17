import { handle, json, redirect } from "next-runtime"
import { Form } from "next-runtime/form"
import Link from "next/link"
import { useRouter } from "next/router"
import { z } from "zod"
import { createSessionHelpers } from "../db/session"
import { loginUser } from "../db/user"
import { AuthPageLayout } from "../modules/auth/AuthPageLayout"
import { Button } from "../modules/dom/Button"
import { usePendingFormNavigation } from "../modules/routing/usePendingFormNavigation"
import { solidButtonClass } from "../modules/ui/button"
import { TextInputField } from "../modules/ui/TextInputField"

type Props = {
  errorMessage?: string
}

const loginBodySchema = z.object({
  email: z.string().email(`Must be a valid email`),
  password: z.string(),
})

export const getServerSideProps = handle<Props>({
  async get(context) {
    const user = await createSessionHelpers(context).getUser()
    return user ? redirect("/") : json({})
  },

  async post(context) {
    const result = loginBodySchema.safeParse(context.req.body)
    if (!result.success) {
      const message = result.error.issues
        .map((error) => error.message)
        .join("\n")
      return json({ errorMessage: message })
    }

    const session = createSessionHelpers(context)
    const user = await loginUser(result.data)
    if (!user) {
      return json({ errorMessage: "Invalid email or password" })
    }

    await session.createSession(user)
    return json({})
  },
})

export default function LoginPage(props: Props) {
  const navigating = usePendingFormNavigation()
  const router = useRouter()

  return (
    <AuthPageLayout title="log in">
      <Form
        className={AuthPageLayout.formClass}
        method="post"
        onSuccess={() => router.replace("/")}
      >
        <TextInputField.Email name="email" required />
        <TextInputField.Password
          name="password"
          required
          isNewPassword={false}
        />
        <Button className={solidButtonClass} type="submit" loading={navigating}>
          log in
        </Button>
      </Form>

      {props.errorMessage ? (
        <AuthPageLayout.Paragraph>
          {props.errorMessage}
        </AuthPageLayout.Paragraph>
      ) : null}

      <AuthPageLayout.Paragraph>
        don't have an account?{" "}
        <Link href="/signup" passHref>
          <AuthPageLayout.Anchor>sign up</AuthPageLayout.Anchor>
        </Link>
      </AuthPageLayout.Paragraph>
    </AuthPageLayout>
  )
}
