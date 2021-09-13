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

export default function LoginPage() {
  const { query } = useRouter()
  return (
    <div>
      <h1>log in</h1>
      <form action="/api/login" method="post">
        <label>
          email
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          password
          <input
            name="password"
            type="password"
            autoComplete="current-password"
          />
        </label>
        <button type="submit">log in</button>
      </form>
      {query.error && <p>{query.error}</p>}
      <p>
        don't have an account? <Link href="/signup">sign up</Link>
      </p>
    </div>
  )
}
