import type { AppProps } from "next/app"
import { AppHead } from "../modules/app/AppHead"
import { NavigationIndicator } from "../modules/routing/NavigationIndicator"
import "../tailwind.css"

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <AppHead />
      <Component {...pageProps} />
      <NavigationIndicator />
    </>
  )
}
