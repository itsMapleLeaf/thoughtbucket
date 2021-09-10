import { ActionFunction, redirect } from "@remix-run/server-runtime"
import bcrypt from "bcryptjs"
import { Link } from "react-router-dom"
import { LoaderFunction } from "remix"
import { raise } from "~/helpers"
import { prisma } from "~/prisma"
import { createSession, getSession } from "~/session"

export const loader: LoaderFunction = async (args) => {
  const session = await getSession(args.request)
  if (session) {
    return redirect("/")
  }
}

export const action: ActionFunction = async ({ request }) => {
  const body = new URLSearchParams(await request.text())

  const user = await prisma.user.create({
    data: {
      name: body.get("name") ?? raise("name not provided"),
      email: body.get("email") ?? raise("email not provided"),
      passwordHash: await bcrypt.hash(
        body.get("password") ?? raise("password not provided"),
        10,
      ),
    },
  })

  return redirect("/", {
    headers: {
      "Set-Cookie": await createSession(user),
    },
  })
}

export default function SignupPage() {
  return (
    <div>
      <h1>sign up</h1>
      <form method="post">
        <label>
          username
          <input
            name="name"
            type="text"
            autoComplete="username"
            defaultValue="maple"
            required
          />
        </label>
        <label>
          email
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          password
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
          />
        </label>
        <button type="submit">sign up</button>
      </form>
      <p>
        already have an account? <Link to="/login">login</Link>
      </p>
    </div>
  )
}
