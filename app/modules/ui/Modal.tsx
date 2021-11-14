/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Portal } from "@headlessui/react"
import clsx from "clsx"
import type { ReactNode } from "react"
import { FocusOn } from "react-focus-on"
import { cardClass } from "./card"

export type ModalProps = {
  title: ReactNode
  children: ReactNode
  open?: boolean
  onClose?: () => void
}

export function Modal({ title, children, open, onClose }: ModalProps) {
  if (!open) return null
  return (
    <Portal>
      <FocusOn onEscapeKey={onClose}>
        <div
          className="fixed inset-0 flex flex-col p-4 overflow-y-auto bg-black/50"
          onClick={onSelf(() => onClose?.())}
        >
          {/* TODO?: add close button to ensure it can always be closed */}
          <div className={clsx(cardClass, "m-auto w-full max-w-md p-4")}>
            <h2 id="dialog-title" className="mb-4 text-2xl font-light">
              {title}
            </h2>
            {children}
          </div>
        </div>
      </FocusOn>
    </Portal>
  )
}

Modal.buttonGroupClass = clsx`flex items-baseline flex-wrap justify-end gap-4`

type TargetProps = {
  target: unknown
  currentTarget: unknown
}

const onSelf =
  <E extends TargetProps>(callback: (event: E) => void) =>
  (event: E) => {
    if (event.target === event.currentTarget) {
      callback(event)
    }
  }
