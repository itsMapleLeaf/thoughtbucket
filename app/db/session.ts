import { Session } from "@prisma/client"
import { createCookie } from "remix"
import { db } from "./client"

const sessionCookie = createCookie("session", {
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 30, // 30 days
})

export async function getSession(
  request: Request,
): Promise<Session | undefined> {
  const id: unknown = await sessionCookie.parse(request.headers.get("Cookie"))
  if (typeof id !== "string") return

  const session = await db.session.findUnique({
    where: { id },
  })
  return session ?? undefined
}

export async function createSessionCookie(user: {
  id: string
}): Promise<string> {
  const session = await createSession(user)
  return await sessionCookie.serialize(session.id)
}

export async function createSession(user: { id: string }) {
  return await db.session.upsert({
    where: { userId: user.id },
    update: { userId: user.id },
    create: { userId: user.id },
    select: { id: true },
  })
}

export async function deleteSession(request: Request): Promise<string> {
  const session = await getSession(request)
  if (session) {
    await db.session.delete({ where: { id: session.id } })
  }
  return await sessionCookie.serialize("")
}