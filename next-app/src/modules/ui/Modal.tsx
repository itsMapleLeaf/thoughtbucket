/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Portal } from "@headlessui/react"
import clsx from "clsx"
import type { ReactNode } from "react"
import { useState } from "react"
import { FocusOn } from "react-focus-on"
import { cardClass } from "./card"

export function Modal(props: {
  title: ReactNode
  renderTrigger: (props: { onClick: () => void }) => React.ReactNode
  renderContent: (props: { close: () => void }) => React.ReactNode
}) {
  const [visible, setVisible] = useState(false)
  const open = () => setVisible(true)
  const close = () => setVisible(false)

  return (
    <>
      {props.renderTrigger({ onClick: open })}
      {visible && (
        <Portal>
          <FocusOn onEscapeKey={close}>
            <div
              className="fixed inset-0 flex flex-col p-4 overflow-y-auto bg-black/50"
              onClick={onSelf(close)}
            >
              {/* TODO?: add close button to ensure it can always be closed */}
              <div className={clsx(cardClass, "m-auto w-full max-w-md p-4")}>
                <h2 id="dialog-title" className="mb-4 text-2xl font-light">
                  {props.title}
                </h2>
                {props.renderContent({ close })}
              </div>
            </div>
          </FocusOn>
        </Portal>
      )}
    </>
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
