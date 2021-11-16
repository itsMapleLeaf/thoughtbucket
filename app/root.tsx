import type { DataFunctionArgs, MetaFunction } from "@remix-run/server-runtime"
import { Outlet } from "react-router-dom"
import type { LinksFunction } from "remix"
import { Links, LiveReload, Meta, Scripts, useCatch } from "remix"
import { AppLayout } from "~/modules/app/AppLayout"
import { getAppMeta } from "~/modules/app/getAppMeta"
import { SystemMessage } from "~/modules/app/SystemMessage"
import { sessionHelpers } from "~/modules/auth/session"
import { toError } from "~/modules/common/helpers"
import { useLoaderDataTyped } from "~/modules/remix/data"
import { NavigationIndicator } from "~/modules/routing/NavigationIndicator"
import stylesUrl from "~/styles/tailwind.css"

export async function loader({ request }: DataFunctionArgs) {
  const user = await sessionHelpers(request).getUser()
  return { user }
}

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }]
}

export const meta: MetaFunction = () => getAppMeta()

export default function Root() {
  const { user } = useLoaderDataTyped<typeof loader>()
  return (
    <Document>
      <AppLayout user={user}>
        <Outlet />
      </AppLayout>
    </Document>
  )
}

export function CatchBoundary() {
  const caught = useCatch()
  const { user } = useLoaderDataTyped<typeof loader>() ?? {}

  if (caught.status === 404) {
    return (
      <Document title={`not found`}>
        <AppLayout user={user}>
          <SystemMessage title="oops">
            {"couldn't find what you were looking for :("}
          </SystemMessage>
        </AppLayout>
      </Document>
    )
  }

  throw new Error(`Unexpected caught response with status ${caught.status}`)
}

export function ErrorBoundary({ error }: { error: unknown }) {
  const { user } = useLoaderDataTyped<typeof loader>() ?? {}
  const { stack, message } = toError(error)

  console.error(error)

  return (
    <Document title="oops">
      <AppLayout user={user}>
        <SystemMessage title="oops">
          <pre className="p-3 overflow-x-auto rounded-md shadow-inner bg-black/50">
            {stack || message}
          </pre>
        </SystemMessage>
      </AppLayout>
    </Document>
  )
}

function Document({
  children,
  title,
}: {
  children: React.ReactNode
  title?: string
}) {
  return (
    <html
      lang="en"
      className="break-words text-slate-100 bg-slate-900 selection:bg-white/30"
    >
      <head>
        <meta charSet="utf-8" />

        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&display=swap"
          rel="stylesheet"
        />

        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <NavigationIndicator />
        <Scripts />
        {process.env.NODE_ENV !== "production" && <LiveReload />}
      </body>
    </html>
  )
}
