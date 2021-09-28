import { Portal } from "@headlessui/react"
import React, { useEffect } from "react"
import type { XYCoord } from "react-dnd"
import {
  DndProvider,
  useDrag as useDragBase,
  useDragDropManager,
  useDrop as useDropBase,
} from "react-dnd"
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

type DragState = {
  isDragging: boolean
  elementOffset: XYCoord
  mousePosition: XYCoord
}

const origin: XYCoord = { x: 0, y: 0 }

export function createDndHooks<Item>(options: { type: string }) {
  function useDrag({ item }: { item: Item }) {
    const [dragState, dragRef] = useDragBase<Item, unknown, DragState>({
      type: options.type,
      item,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
        elementOffset: monitor.getInitialSourceClientOffset() ?? origin,
        mousePosition: monitor.getDifferenceFromInitialOffset() ?? origin,
      }),
    })

    return [dragState, dragRef] as const
  }

  function useDrop({ onDrop }: { onDrop: (item: Item) => void }) {
    const [dropState, dropRef] = useDropBase({
      accept: options.type,
      drop: (info: Item, monitor) => {
        if (monitor.didDrop()) return
        onDrop(info)
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    })

    return [dropState, dropRef] as const
  }

  return { useDrag, useDrop }
}

export function DragPreview({
  state,
  children,
}: {
  state: DragState
  children: React.ReactNode
}) {
  if (!state.isDragging) {
    return <>{children}</>
  }

  const x = state.elementOffset.x + state.mousePosition.x
  const y = state.elementOffset.y + state.mousePosition.y
  return (
    <>
      <div className="opacity-0 pointer-events-none">{children}</div>
      <Portal>
        <div
          className="fixed top-0 left-0 pointer-events-none"
          style={{ transform: `translate(${x}px, ${y}px) rotate(-3deg)` }}
        >
          {children}
        </div>
      </Portal>
    </>
  )
}
