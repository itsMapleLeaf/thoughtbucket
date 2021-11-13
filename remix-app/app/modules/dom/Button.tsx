import clsx from "clsx"
import type { ComponentPropsWithoutRef } from "react"
import { useState } from "react"
import { LoadingIcon } from "../ui/LoadingIcon"

export type ButtonProps = Omit<
  ComponentPropsWithoutRef<"button">,
  "onClick"
> & {
  loading?: unknown
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void | Promise<unknown>
}

export function Button({
  loading,
  className,
  disabled,
  children,
  onClick,
  ...props
}: ButtonProps) {
  const [clickPending, setClickPending] = useState(false)
  const interactionDisabled = !!loading || disabled || clickPending
  return (
    <button
      type="button"
      {...props}
      // alternate, more accessible disabled behavior
      disabled={false}
      className={clsx(
        className,
        interactionDisabled &&
          "opacity-75 pointer-events-none cursor-not-allowed",
      )}
      onClick={async (event) => {
        if (disabled || loading || clickPending) {
          event.preventDefault()
          return
        }

        setClickPending(true)

        try {
          await onClick?.(event)
        } catch (error) {
          // eslint-disable-next-line no-console
          console.warn("error from button click:", error)
        }

        setClickPending(false)
      }}
    >
      {loading ? <LoadingIcon size={2} /> : children}
    </button>
  )
}
