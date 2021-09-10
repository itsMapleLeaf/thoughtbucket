import {
  ActionFunction,
  LoaderFunction,
  redirect,
} from "@remix-run/server-runtime"
import bcrypt from "bcryptjs"
import { Link } from "react-router-dom"
import { z } from "zod"
import { createFormModuleWithSchema } from "~/form"
import { prisma } from "~/prisma"
import { createSession, getSession } from "~/session"

const loginForm = createFormModuleWithSchema(
  z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
)

export const loader: LoaderFunction = async (args) => {
  const session = await getSession(args.request)
  if (session) {
    return redirect("/")
  }
  return {}
}

export const action: ActionFunction = async (args) => {
  const body = await loginForm.getBody(args.request)

  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  })

  if (!user) {
    return new Response(undefined, {
      status: 401,
      statusText: "invalid email or password",
    })
  }

  const valid = await bcrypt.compare(body.password, user.passwordHash)
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
          <loginForm.Input
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </label>
        <label>
          password
          <loginForm.Input
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
