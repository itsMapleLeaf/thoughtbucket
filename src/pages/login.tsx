import { GetServerSideProps } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { createSessionHelpers } from "../db/session"
import { AuthPageLayout } from "../modules/auth/AuthPageLayout"
import { Button } from "../modules/dom/Button"
import { solidButtonClass } from "../modules/ui/button"
import { TextInputField } from "../modules/ui/TextInputField"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await createSessionHelpers(context).getUser()
  if (user) {
    return {
      redirect: { destination: "/", permanent: false },
    }
  }

  return {
    props: {},
  }
}

export default function LoginPage() {
  const { query } = useRouter()
  return (
    <AuthPageLayout title="log in">
      <AuthPageLayout.Form action="/api/auth/login" method="post">
        <TextInputField.Email name="email" required />
        <TextInputField.Password
          name="password"
          required
          isNewPassword={false}
        />
        <Button className={solidButtonClass} type="submit">
          log in
        </Button>
      </AuthPageLayout.Form>

      {query.error && (
        <AuthPageLayout.Paragraph>{query.error}</AuthPageLayout.Paragraph>
      )}

      <AuthPageLayout.Paragraph>
        don't have an account?{" "}
        <Link href="/signup" passHref>
          <AuthPageLayout.Anchor>sign up</AuthPageLayout.Anchor>
        </Link>
      </AuthPageLayout.Paragraph>
    </AuthPageLayout>
  )
}
