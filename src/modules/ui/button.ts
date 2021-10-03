import clsx from "clsx"
import { activePressClass } from "./effects"

const solidButtonBaseClass = clsx`
  px-3 py-2
  rounded
  leading-none text-shadow text-white
  shadow
  transition
  font-semibold
`

export const solidButtonClass = clsx`
  ${solidButtonBaseClass}
  ${activePressClass}
 bg-sky-700 hover:bg-sky-800
`

export const solidDangerButtonClass = clsx`
  ${solidButtonBaseClass}
  ${activePressClass}
  bg-red-700 hover:bg-red-800
`

export const fadedButtonClass = clsx`
  px-2 py-1 -mx-2 -my-1 opacity-60 text-shadow leading-none transition
  hover:opacity-100
  ${activePressClass}
`
