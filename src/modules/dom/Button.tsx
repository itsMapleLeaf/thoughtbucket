import clsx from "clsx"
import type { ComponentPropsWithoutRef } from "react"
import React from "react"
import { LoadingIcon } from "../ui/LoadingIcon"

export type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  loading?: unknown
}

export function Button({
  loading,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      {...props}
      // alternate, more accessible disabled behavior
      disabled={false}
      className={clsx(
        className,
        (Boolean(loading) || disabled) &&
          "opacity-75 pointer-events-none cursor-not-allowed",
      )}
      onClick={(event) => {
        if (disabled || loading) return
        props.onClick?.(event)
      }}
    >
      {loading ? <LoadingIcon size={2} /> : children}
    </button>
  )
}
