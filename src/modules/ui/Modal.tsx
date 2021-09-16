import { Portal } from "@headlessui/react"
import clsx from "clsx"
import { ReactNode, useState } from "react"
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
              <div
                className={clsx(cardClass, "m-auto w-full max-w-md p-4")}
                role="dialog"
                aria-labelledby="dialog-title"
              >
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
