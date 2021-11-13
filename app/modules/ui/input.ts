import clsx from "clsx"

const inputBaseClass = clsx`px-3 py-2 transition-colors bg-black/30 focus:outline-none focus:bg-black/60 block w-full shadow-inner`

export const textInputClass = clsx(inputBaseClass, "leading-none rounded-md")

export const textAreaClass = clsx(inputBaseClass)
