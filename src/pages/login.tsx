import { GetServerSideProps } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { createSessionHelpers } from "../db/session"
import { AppLayout } from "../modules/app/AppLayout"
import { Button } from "../modules/dom/Button"
import { solidButtonClass } from "../modules/ui/button"
import { containerSmallClass } from "../modules/ui/container"
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
    <AppLayout user={undefined}>
      <div
        className={`${containerSmallClass} bg-gray-800 p-4 rounded-md shadow`}
      >
        <h1 className="text-3xl font-light">log in</h1>
        <form
          action="/api/auth/login"
          method="post"
          className="grid gap-3 mt-4 justify-items-start"
        >
          <TextInputField.Email
            name="email"
            required
            data-testid="login-email"
          />
          <TextInputField.Password
            name="password"
            required
            isNewPassword={false}
            data-testid="login-password"
          />
          <Button
            className={solidButtonClass}
            data-testid="login-submit"
            type="submit"
          >
            log in
          </Button>
        </form>

        {query.error && <p className="mt-4">{query.error}</p>}

        <p className="mt-4">
          don't have an account?{" "}
          <Link href="/signup">
            <a className="underline">sign up</a>
          </Link>
        </p>
      </div>
    </AppLayout>
  )
}
