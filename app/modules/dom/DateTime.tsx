type DateTimeProps = Intl.DateTimeFormatOptions & {
  date: string | number | Date

  // these properties used to exist in the typedefs, but they got yeeted for some reason
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#parameters
  dateStyle?: "full" | "long" | "medium" | "short"
  timeStyle?: "full" | "long" | "medium" | "short"
}

export function DateTime({ date, ...options }: DateTimeProps) {
  return (
    <time dateTime={new Date(date).toISOString()}>
      {new Date(date).toLocaleString(undefined, options)}
    </time>
  )
}
