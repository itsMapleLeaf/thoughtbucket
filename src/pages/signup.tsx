import { GetServerSideProps } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { createSessionHelpers } from "../db/session"
import { AuthPageLayout } from "../modules/auth/AuthPageLayout"
import { Button } from "../modules/dom/Button"
import { solidButtonClass } from "../modules/ui/button"
import { TextInputField } from "../modules/ui/TextInputField"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = createSessionHelpers(context)

  if (await session.getSession()) {
    return {
      redirect: { destination: "/", permanent: false },
    }
  }

  return {
    props: {},
  }
}

export default function SignupPage() {
  const { query } = useRouter()
  return (
    <AuthPageLayout title="sign up">
      <AuthPageLayout.Form action="/api/auth/signup" method="post">
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
      </AuthPageLayout.Form>

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
