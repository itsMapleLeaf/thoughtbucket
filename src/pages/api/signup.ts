import { NextApiHandler } from "next"
import { z } from "zod"
import { createSessionManager } from "../../db/session"
import { createUser } from "../../db/user"

const signupBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
})

const handler: NextApiHandler = async (req, res) => {
  const body = signupBodySchema.parse(req.body)

  const user = await createUser(body)

  const session = createSessionManager({ req, res })
  await session.createSession(user)

  res.redirect("/buckets")
}
export default handler
