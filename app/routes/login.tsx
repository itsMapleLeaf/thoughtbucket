import {
  ActionFunction,
  LoaderFunction,
  redirect,
} from "@remix-run/server-runtime"
import bcrypt from "bcryptjs"
import { Link } from "react-router-dom"
import { raise } from "~/helpers"
import { prisma } from "~/prisma"
import { createSession, getSession } from "~/session"

export const loader: LoaderFunction = async (args) => {
  const session = await getSession(args.request)
  if (session) {
    return redirect("/")
  }
}

export const action: ActionFunction = async (args) => {
  const request = args.request.clone()
  const body = new URLSearchParams(await request.text())

  const user = await prisma.user.findUnique({
    where: {
      email: body.get("email") ?? raise("email not provided"),
    },
  })

  if (!user) {
    return new Response(undefined, {
      status: 401,
      statusText: "invalid email or password",
    })
  }

  const valid = await bcrypt.compare(
    body.get("password") ?? raise("password not provided"),
    user.passwordHash,
  )

  if (!valid) {
    return new Response(undefined, {
      status: 401,
      statusText: "invalid email or password",
    })
  }

  return redirect("/", {
    headers: {
      "Set-Cookie": await createSession(user),
    },
  })
}

export default function LoginPage() {
  return (
    <div>
      <h1>log in</h1>
      <form method="post">
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
        <button type="submit">Login</button>
      </form>
      <p>
        don't have an account? <Link to="/signup">sign up</Link>
      </p>
    </div>
  )
}
