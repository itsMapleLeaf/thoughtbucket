import produce from "immer"
import { nanoid } from "nanoid"
import type { Observable } from "rxjs"
import { switchMap } from "rxjs"
import type { EditBucketBody } from "~/modules/bucket/forms"
import type { DeepReadonly } from "~/modules/common/types"
import type { FetchState } from "../network/fetchWithRetry"
import { fetchJsonWithRetry } from "../network/fetchWithRetry"
import { Store } from "../state/Store"
import type { Column } from "./Column"

export class ColumnEditorStore extends Store<readonly Column[]> {
  fetchStream: Observable<FetchState | { status: "idle" }>

  constructor(bucketId: string, initialColumns: readonly Column[]) {
    super(initialColumns)

    this.fetchStream = this.stateStream.pipe(
      switchMap((columns) => {
        if (columns === initialColumns) {
          return [{ status: "idle" as const }]
        }

        const data: DeepReadonly<EditBucketBody> = {
          columns,
        }

        return fetchJsonWithRetry({
          url: `/buckets/${bucketId}`,
          method: "patch",
          data,
        })
      }),
    )
  }

  addColumn(name: string) {
    this.setState([...this.state, { id: nanoid(), name, thoughts: [] }])
  }

  removeColumn(columnId: string) {
    this.setState(this.state.filter((column) => column.id !== columnId))
  }

  renameColumn(columnId: string, newName: string) {
    this.setState(
      this.state.map((column) =>
        column.id === columnId ? { ...column, name: newName } : column,
      ),
    )
  }

  moveColumn(oldIndex: number, newIndex: number) {
    this.updateState(
      produce((draft) => {
        const removed = draft.splice(oldIndex, 1)
        draft.splice(newIndex, 0, ...removed)
      }),
    )
  }

  addThought(columnId: string, text: string) {
    this.updateState(
      produce((draft) => {
        const column = draft.find((c) => c.id === columnId)
        column?.thoughts.unshift({ id: nanoid(), text })
      }),
    )
  }

  removeThought(columnId: string, thoughtId: string) {
    this.updateState(
      produce((draft) => {
        const column = draft.find((c) => c.id === columnId)
        if (column) {
          column.thoughts = column.thoughts.filter((t) => t.id !== thoughtId)
        }
      }),
    )
  }

  editThought(columnId: string, thoughtId: string, text: string) {
    this.updateState(
      produce((draft) => {
        const column = draft.find((c) => c.id === columnId)
        if (column) {
          const thought = column.thoughts.find((t) => t.id === thoughtId)
          if (thought) {
            thought.text = text
          }
        }
      }),
    )
  }

  moveThought(args: MoveThoughtArgs) {
    if (
      args.from.columnId === args.to.columnId &&
      args.from.index === args.to.index
    )
      return

    this.updateState(
      produce((draft) => {
        const fromColumn = draft.find((c) => c.id === args.from.columnId)
        const toColumn = draft.find((c) => c.id === args.to.columnId)
        if (!fromColumn || !toColumn) return

        const removed = fromColumn.thoughts.splice(args.from.index, 1)
        toColumn.thoughts.splice(args.to.index, 0, ...removed)
      }),
    )
  }
}

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
