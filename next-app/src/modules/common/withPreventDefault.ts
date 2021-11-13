type HasPreventDefault = {
  preventDefault: () => void
}

export const withPreventDefault =
  <EventType extends HasPreventDefault>(callback: (event: EventType) => void) =>
  (event: EventType) => {
    event.preventDefault()
    callback(event)
  }
