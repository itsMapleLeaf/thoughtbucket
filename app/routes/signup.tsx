import { Link } from "react-router-dom"
import { ActionFunction, LoaderFunction, redirect } from "remix"
import { z } from "zod"
import { createFormModuleWithSchema } from "~/form"
import { createSession, getSession } from "~/session"
import { createUser } from "../user"

const { Input, getBody } = createFormModuleWithSchema(
  z.object({
    name: z.string(),
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

export const action: ActionFunction = async ({ request }) => {
  const body = await getBody(request)

  const user = await createUser(body)

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
          <Input
            name="name"
            type="text"
            autoComplete="username"
            defaultValue="maple"
            required
          />
        </label>
        <label>
          email
          <Input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          password
          <Input
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
