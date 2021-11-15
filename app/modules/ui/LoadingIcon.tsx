import clsx from "clsx"
import React from "react"

export function LoadingIcon({ size = 4 }: { size?: 2 | 4 | 6 }) {
  const dotSizeClass = {
    2: clsx`w-2 h-2`,
    4: clsx`w-4 h-4`,
    6: clsx`w-6 h-6`,
  }[size]

  return (
    <div
      className={clsx(
        "grid gap-2 place-content-center place-items-center grid-cols-2 grid-rows-2 drop-shadow",
        size === 2 && "gap-1",
        size === 4 && "gap-2",
        size === 6 && "gap-4",
        "spin",
      )}
    >
      <div className={clsx("bg-white rounded-full", dotSizeClass)}></div>
      <div className={clsx("bg-sky-500 rounded-full", dotSizeClass)}></div>
      <div className={clsx("bg-sky-500 rounded-full", dotSizeClass)}></div>
      <div className={clsx("bg-white rounded-full", dotSizeClass)}></div>
    </div>
  )
}
