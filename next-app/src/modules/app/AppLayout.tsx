import React from "react"
import { AppHeader } from "./AppHeader"

export function AppLayout({
  user,
  children,
}: {
  user: { name: string } | undefined
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-full">
      <AppHeader user={user} />
      <main className="flex-1 min-h-0 mt-6">{children}</main>
    </div>
  )
}
