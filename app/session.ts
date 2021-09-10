import { Session } from "@prisma/client"
import { createCookie } from "remix"
import { prisma } from "~/prisma"

const sessionCookie = createCookie("session", {
  path: "/",
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 30, // 30 days
})

export async function getSession(
  request: Request,
): Promise<Session | undefined> {
  const id: unknown = await sessionCookie.parse(request.headers.get("Cookie"))
  if (typeof id !== "string") return

  const session = await prisma.session.findUnique({
    where: { id },
  })
  return session ?? undefined
}

export async function createSession(user: { id: string }): Promise<string> {
  const session = await prisma.session.upsert({
    where: { userId: user.id },
    update: { userId: user.id },
    create: { userId: user.id },
    select: { id: true },
  })

  return await sessionCookie.serialize(session.id)
}

export async function deleteSession(request: Request): Promise<string> {
  const session = await getSession(request)
  if (session) {
    await prisma.session.delete({ where: { id: session.id } })
  }
  return await sessionCookie.serialize("")
}
