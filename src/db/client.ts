import { PrismaClient } from "@prisma/client"

let db: PrismaClient | undefined

export function getClient() {
  return (db ??= new PrismaClient())
}
