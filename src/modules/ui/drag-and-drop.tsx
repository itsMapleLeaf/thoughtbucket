import { Portal } from "@headlessui/react"
import React, { useEffect } from "react"
import type { ConnectDragSource } from "react-dnd"
import { DndProvider, useDrag, useDragDropManager } from "react-dnd"
import type { TouchBackendOptions } from "react-dnd-touch-backend"
import { TouchBackend } from "react-dnd-touch-backend"
import { clamp } from "../../helpers"

const touchBackendOptions: Partial<TouchBackendOptions> = {
  enableMouseEvents: true,
  delayTouchStart: 500,
}

export function ScrollingDndProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DndProvider backend={TouchBackend} options={touchBackendOptions}>
      {children}
      <DragScroller />
    </DndProvider>
  )
}

const scrollThreshold = 50

export function DragScroller() {
  const manager = useDragDropManager()

  useEffect(() => {
    let running = true

    function scrollElements(delta: number) {
      const offset = manager.getMonitor().getClientOffset()
      if (!offset) return

      const x = clamp(offset.x, 0, window.innerWidth - 1)
      const y = clamp(offset.y, 0, window.innerHeight - 1)

      for (const element of document.elementsFromPoint(x, y)) {
        const rect = element.getBoundingClientRect()
        if (x >= rect.right - scrollThreshold) {
          element.scrollLeft += 300 * delta
        }
        if (x <= rect.left + scrollThreshold) {
          element.scrollLeft -= 300 * delta
        }
      }
    }

    requestAnimationFrame((currentTime) => {
      requestAnimationFrame(function runFrame(newTime) {
        const delta = (newTime - currentTime) / 1000
        currentTime = newTime

        scrollElements(delta)
        if (running) {
          requestAnimationFrame(runFrame)
        }
      })
    })

    return () => {
      running = false
    }
  }, [manager])

  return null
}

export function Draggable<Item>({
  type,
  item,
  children,
}: {
  type: string
  item: Item
  children: (props: {
    ref: ConnectDragSource
    isDragging: boolean
  }) => React.ReactNode
}) {
  const [{ isDragging, mousePosition, elementOffset }, dragRef] = useDrag({
    type,
    item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      elementOffset: monitor.getInitialSourceClientOffset(),
      mousePosition: monitor.getDifferenceFromInitialOffset(),
    }),
  })

  const content = children({
    ref: dragRef,
    isDragging,
  })

  const shouldShowPreview = isDragging && mousePosition && elementOffset

  if (!shouldShowPreview) {
    return <>{content}</>
  }

  const x = elementOffset.x + mousePosition.x
  const y = elementOffset.y + mousePosition.y
  return (
    <>
      <div className="opacity-0 pointer-events-none">{content}</div>
      <Portal>
        <div
          className="fixed top-0 left-0 pointer-events-none"
          style={{ transform: `translate(${x}px, ${y}px) rotate(-3deg)` }}
        >
          {content}
        </div>
      </Portal>
    </>
  )
}
