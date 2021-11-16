import { PrismaClient } from "@prisma/client"

export function getClient() {
  return (globalThis.prismaClient ??= new PrismaClient({
    // log: ["info", "query", "warn", "error"],
  }))
}

declare namespace globalThis {
  let prismaClient: PrismaClient | undefined
}
