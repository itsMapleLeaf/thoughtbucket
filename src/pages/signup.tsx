import { GetServerSideProps } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { createSessionHelpers } from "../db/session"

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
    <div>
      <h1>sign up</h1>
      <form action="/api/auth/signup" method="post">
        <label>
          username
          <input
            data-testid="signup-name"
            name="name"
            type="text"
            autoComplete="name"
            required
          />
        </label>
        <label>
          email
          <input
            data-testid="signup-email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </label>
        <label>
          password
          <input
            data-testid="signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
          />
        </label>
        <button data-testid="signup-submit" type="submit">
          sign up
        </button>
      </form>
      {query.error && <p>{query.error}</p>}
      <p>
        already have an account? <Link href="/login">log in</Link>
      </p>
    </div>
  )
}
