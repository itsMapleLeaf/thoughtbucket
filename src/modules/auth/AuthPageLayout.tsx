import clsx from "clsx"
import { ComponentPropsWithoutRef, forwardRef, ReactNode } from "react"
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

AuthPageLayout.Form = function AuthPageForm(
  props: ComponentPropsWithoutRef<"form">,
) {
  return <form className="grid gap-3 mt-4 justify-items-start" {...props} />
}

AuthPageLayout.Paragraph = function AuthPageParagraph(
  props: ComponentPropsWithoutRef<"p">,
) {
  return <p className="mt-4" {...props} />
}

AuthPageLayout.Anchor = forwardRef(function AuthPageAnchor(
  props: ComponentPropsWithoutRef<"a">,
  ref: React.Ref<HTMLAnchorElement>,
) {
  return <a className="underline" {...props} ref={ref} />
})
