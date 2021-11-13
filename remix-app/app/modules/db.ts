import { PrismaClient } from "@prisma/client"

export function getClient() {
  return (globalThis.prismaClient ??= new PrismaClient())
}

declare namespace globalThis {
  let prismaClient: PrismaClient | undefined
}
