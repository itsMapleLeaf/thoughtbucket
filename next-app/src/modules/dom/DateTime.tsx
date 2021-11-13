import React from "react"

export function DateTime({
  date,
  ...options
}: { date: string | number | Date } & Intl.DateTimeFormatOptions) {
  return (
    <time dateTime={new Date(date).toISOString()}>
      {new Date(date).toLocaleString(undefined, options)}
    </time>
  )
}
