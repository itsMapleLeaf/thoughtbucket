import type { DataFunctionArgs } from "@remix-run/server-runtime"
import clsx from "clsx"
import type { ComponentPropsWithoutRef } from "react"
import { Outlet, redirect } from "remix"
import { sessionHelpers } from "~/modules/auth/session"
import { cardClass } from "~/modules/ui/card"
import { containerSmallClass } from "~/modules/ui/container"

export async function loader({ request }: DataFunctionArgs) {
  const user = await sessionHelpers(request).getUser()
  return user ? redirect("/buckets") : new Response()
}

export default function AuthPageLayout() {
  return (
    <div className={clsx(containerSmallClass, cardClass, "p-4")}>
      <Outlet />
    </div>
  )
}

AuthPageLayout.titleClass = "text-3xl font-light"

AuthPageLayout.formClass = "grid gap-3 mt-4 justify-items-start"

AuthPageLayout.Paragraph = function AuthPageParagraph(
  props: ComponentPropsWithoutRef<"p">,
) {
  return <p {...props} className={clsx("mt-4", props.className)} />
}
