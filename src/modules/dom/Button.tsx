import clsx from "clsx"
import type { ComponentPropsWithoutRef } from "react"
import React from "react"

export type ButtonProps = ComponentPropsWithoutRef<"button">

export function Button(props: ButtonProps) {
  return (
    <button
      type="button"
      {...props}
      // alternate, more accessible disabled behavior
      disabled={false}
      className={clsx(
        props.disabled && "opacity-75 pointer-events-none cursor-not-allowed",
        props.className,
      )}
      onClick={(event) => {
        if (!props.disabled) {
          props.onClick?.(event)
        }
      }}
    />
  )
}
