import clsx from "clsx"
import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { AppLayout } from "../app/AppLayout"
import { cardClass } from "../ui/card"
import { containerSmallClass } from "../ui/container"

export function AuthPageLayout({
  title,
  children,
}: {
  title: ReactNode
  children: ReactNode
}) {
  return (
    <AppLayout user={undefined}>
      <div className={clsx(containerSmallClass, cardClass, "p-4")}>
        <h1 className="text-3xl font-light">{title}</h1>
        {children}
      </div>
    </AppLayout>
  )
}

AuthPageLayout.formClass = "grid gap-3 mt-4 justify-items-start"

AuthPageLayout.Paragraph = function AuthPageParagraph(
  props: ComponentPropsWithoutRef<"p">,
) {
  return <p {...props} className={clsx("mt-4", props.className)} />
}
