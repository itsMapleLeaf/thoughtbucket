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
 bg-green-700 hover:bg-green-800
`

export const solidDangerButtonClass = clsx`
  ${solidButtonBaseClass}
  ${activePressClass}
  bg-red-700 hover:bg-red-800
`

export const fadedButtonClass = clsx`
  px-3 py-2 -mx-3 -my-2 opacity-60 text-shadow leading-none transition
  hover:opacity-100
  ${activePressClass}
`
