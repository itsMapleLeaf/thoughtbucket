import { NextApiHandler } from "next"
import { z } from "zod"
import { createSessionHelpers } from "../../../db/session"
import { loginUser } from "../../../db/user"

const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const handler: NextApiHandler = async (req, res) => {
  const body = loginBodySchema.parse(req.body)
  const session = createSessionHelpers({ req, res })

  const user = await loginUser(body)
  if (!user) {
    res.redirect(`/login?error=Invalid username or password`)
  } else {
    await session.createSession(user)

    res.redirect("/")
  }
}
export default handler
