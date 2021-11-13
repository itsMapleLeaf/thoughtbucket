import Head from "next/head"
import React from "react"
import { joinContentfulStrings } from "../common/helpers"

const titleSuffix = "thoughtbucket"

const defaultDescription =
  "a nice and cozy bucket to put all of your thoughts (◕‿◕✿)"

export function AppHead({
  title,
  description = defaultDescription,
}: {
  title?: string
  description?: string
}) {
  return (
    <Head>
      <title>{joinContentfulStrings([title, titleSuffix], " | ")}</title>
      <meta name="description" content={description} />
      <meta name="theme-color" content="#64748b" />
    </Head>
  )
}
