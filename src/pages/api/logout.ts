import { NextApiHandler } from "next"
import { createSessionManager } from "../../db/session"

const handler: NextApiHandler = async (req, res) => {
  await createSessionManager({ req, res }).deleteSession()
  res.redirect("/login")
}
export default handler
