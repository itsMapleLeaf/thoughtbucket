import { GetServerSideProps } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { createSessionManager } from "../db/session"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = createSessionManager(context)

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
      <form action="/api/signup" method="post">
        <label>
          username
          <input name="name" type="text" autoComplete="name" required />
        </label>
        <label>
          email
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          password
          <input name="password" type="password" autoComplete="new-password" />
        </label>
        <button type="submit">sign up</button>
      </form>
      {query.error && <p>{query.error}</p>}
      <p>
        already have an account? <Link href="/login">log in</Link>
      </p>
    </div>
  )
}
