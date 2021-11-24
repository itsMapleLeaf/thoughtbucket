import type { Session, User } from "@prisma/client"
import type { CookieOptions } from "remix"
import { createCookie } from "remix"
import { getClient } from "../db"

export function sessionHelpers(request: Request) {
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    secure:
      process.env.NODE_ENV === "production" &&
      // the app is built with production even when setting the node env to test,
      // so we need this extra env variable to explicitly disable https cookies during tests
      process.env.COOKIE_SECURE !== "false",
  }

  const sessionCookieName = "remix-session"
  const sessionCookie = createCookie(sessionCookieName, cookieOptions)

  const db = getClient()

  const helpers = {
    async get(): Promise<Session | undefined> {
      const id = await sessionCookie.parse(request.headers.get("cookie") || "")
      if (!id) return

      const session = await db.session.findUnique({
        where: { id },
      })
      return session ?? undefined
    },

    async create(user: { id: string }) {
      const session = await db.session.upsert({
        where: { userId: user.id },
        update: { userId: user.id },
        create: { userId: user.id },
        select: { id: true },
      })
      return {
        session,
        responseHeaders: {
          "Set-Cookie": await sessionCookie.serialize(session.id),
        },
      }
    },

    async delete() {
      const session = await helpers.get()
      if (session) {
        await db.session.delete({ where: { id: session.id } })
      }
      return {
        responseHeaders: {
          "Set-Cookie": await sessionCookie.serialize(""),
        },
      }
    },

    async getUser(): Promise<User | undefined> {
      const session = await helpers.get()
      if (!session) return

      const user = await db.user.findUnique({
        where: { id: session.userId },
      })
      return user ?? undefined
    },
  }

  return helpers
}
