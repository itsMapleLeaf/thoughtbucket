import { NextApiHandler } from "next"
import { z } from "zod"
import { createSessionHelpers } from "../../../db/session"
import { createUser } from "../../../db/user"

const signupBodySchema = z.object({
  name: z.string(),
  email: z.string().email(`Please enter a valid email`),
  password: z.string().min(8, `Password must be at least 8 characters long`),
})

const handler: NextApiHandler = async (req, res) => {
  const body = signupBodySchema.safeParse(req.body)
  if (!body.success) {
    const message = body.error.issues.map((error) => error.message).join("\n")
    res.status(400).redirect(`/signup?error=${message}`)
    return
  }

  const user = await createUser(body.data)

  const session = createSessionHelpers({ req, res })
  await session.createSession(user)

  res.redirect("/buckets")
}
export default handler
