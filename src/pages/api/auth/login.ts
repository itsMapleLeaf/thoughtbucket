import { NextApiHandler } from "next"
import { z } from "zod"
import { createSessionHelpers } from "../../../db/session"
import { loginUser } from "../../../db/user"

const loginBodySchema = z.object({
  email: z.string().email(`Must be a valid email`),
  password: z.string(),
})

const handler: NextApiHandler = async (req, res) => {
  const result = loginBodySchema.safeParse(req.body)
  if (!result.success) {
    res.status(400).redirect(`/login?error=${result.error.message}`)
    return
  }

  const session = createSessionHelpers({ req, res })
  const user = await loginUser(result.data)
  if (!user) {
    res.redirect(`/login?error=Invalid username or password`)
  } else {
    await session.createSession(user)

    res.redirect("/")
  }
}
export default handler
