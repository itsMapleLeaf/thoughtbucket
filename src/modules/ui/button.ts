import clsx from "clsx"
import { activePressClass } from "./effects"

export const solidButtonClass = clsx`
  px-3 py-2 rounded leading-none shadow transition font-semibold text-shadow
  text-white bg-green-600 hover:bg-green-700
  ${activePressClass}
`

export const fadedButtonClass = clsx`
  px-3 py-2 -mx-3 -my-2 opacity-60 text-shadow leading-none transition
  hover:opacity-100
  ${activePressClass}
`
