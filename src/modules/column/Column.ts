import type { Draft } from "immer"
import produce from "immer"
import { nanoid } from "nanoid"
import { z } from "zod"

export type Column = z.TypeOf<typeof columnSchema>

export const columnSchema = z.object({
  id: z.string(),
  name: z.string(),
  thoughts: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
    }),
  ),
})

export const addColumnToList = (name: string) => (columns: Column[]) =>
  [...columns, { id: nanoid(), name, thoughts: [] }]

export const removeColumnFromList = (id: string) => (columns: Column[]) =>
  columns.filter((c) => c.id !== id)

export const createThoughtWithinColumn = (args: {
  columnId: string
  text: string
}) =>
  produce((draft: Draft<Column[]>) => {
    const column = draft.find((c) => c.id === args.columnId)
    column?.thoughts.unshift({ id: nanoid(), text: args.text })
  })

export const removeThoughtFromColumn = (args: {
  columnId: string
  thoughtId: string
}) =>
  produce((draft: Draft<Column[]>) => {
    const column = draft.find((c) => c.id === args.columnId)
    if (column) {
      column.thoughts = column.thoughts.filter((t) => t.id !== args.thoughtId)
    }
  })

export type MoveThoughtArgs = {
  from: {
    columnId: string
    index: number
  }
  to: {
    columnId: string
    index: number
  }
}

export const moveThoughtBetweenColumns = (args: MoveThoughtArgs) => {
  if (
    args.from.columnId === args.to.columnId &&
    args.from.index === args.to.index
  )
    return (columns: Column[]) => columns

  return produce((draft: Draft<Column[]>) => {
    const fromColumn = draft.find((c) => c.id === args.from.columnId)
    const toColumn = draft.find((c) => c.id === args.to.columnId)
    if (!fromColumn || !toColumn) return

    const removed = fromColumn.thoughts.splice(args.from.index, 1)
    toColumn.thoughts.splice(args.to.index, 0, ...removed)
  })
}
