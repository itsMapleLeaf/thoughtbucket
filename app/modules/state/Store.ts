import { useCallback, useEffect, useState } from "react"
import type { Subject } from "rxjs"
import { BehaviorSubject } from "rxjs"

export class Store<T> {
  state: T
  readonly stateStream: Subject<T>

  constructor(initialState: T) {
    this.state = initialState
    this.stateStream = new BehaviorSubject(initialState)
  }

  setState(state: T) {
    this.state = state
    this.stateStream.next(state)
  }

  updateState(updater: (state: T) => T) {
    this.setState(updater(this.state))
  }
}

export function useStoreSelector<T>(
  store: Store<T>,
  selector: (state: T) => T,
): T {
  const [state, setState] = useState(selector(store.state))
  useEffect(() => {
    const subscription = store.stateStream.subscribe((state) => {
      setState(selector(state))
    })
    return () => subscription.unsubscribe()
  }, [selector, store.stateStream])
  return state
}

export function useStoreState<T>(store: Store<T>): T {
  return useStoreSelector(
    store,
    useCallback((state) => state, []),
  )
}
