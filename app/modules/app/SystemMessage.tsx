import { containerClass } from "~/modules/ui/container"

export function SystemMessage({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className={containerClass}>
      <h1 className="mb-4 text-3xl font-light">{title}</h1>
      {children}
    </div>
  )
}
