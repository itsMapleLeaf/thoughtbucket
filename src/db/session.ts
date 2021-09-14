import { PrismaClient, Session, User } from "@prisma/client"
import Cookies from "cookies"
import { IncomingMessage, ServerResponse } from "http"

export const sessionCookieName = "session"

const cookieOptions = {
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 30, // 30 days
  secure: process.env.NODE_ENV === "production",
  signed: false,
}

const db = new PrismaClient()

export function createSessionHelpers({
  req,
  res,
}: {
  req: IncomingMessage
  res: ServerResponse
}) {
  const cookies = new Cookies(req, res, cookieOptions)

  async function getSession(): Promise<Session | undefined> {
    const id = cookies.get(sessionCookieName, cookieOptions)
    if (!id) return

    const session = await db.session.findUnique({
      where: { id },
    })
    return session ?? undefined
  }

  async function createSession(user: { id: string }): Promise<void> {
    const session = await db.session.upsert({
      where: { userId: user.id },
      update: { userId: user.id },
      create: { userId: user.id },
      select: { id: true },
    })
    cookies.set(sessionCookieName, session.id, cookieOptions)
  }

  async function deleteSession(): Promise<void> {
    const session = await getSession()
    if (session) {
      await db.session.delete({ where: { id: session.id } })
    }
    cookies.set(sessionCookieName, null, cookieOptions)
  }

  async function getUser(): Promise<User | undefined> {
    const session = await getSession()
    if (!session) return

    const user = await db.user.findUnique({
      where: { id: session.userId },
    })
    return user ?? undefined
  }

  return {
    getSession,
    createSession,
    deleteSession,
    getUser,
  }
}
