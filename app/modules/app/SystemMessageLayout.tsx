import { AppLayout } from "~/modules/app/AppLayout"
import { containerClass } from "~/modules/ui/container"

export function SystemMessageLayout({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <AppLayout user={undefined}>
      <div className={containerClass}>
        <h1 className="mb-4 text-3xl font-light">{title}</h1>
        {children}
      </div>
    </AppLayout>
  )
}
