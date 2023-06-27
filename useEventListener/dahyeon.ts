import { MaybeRef, toRef, watch } from 'vue'

export const noop = () => {}

export function useEventListener(
  target: MaybeRef<HTMLElement | Window>,
  event: string | string[],
  listener: Function | Function[],
  options: boolean | EventListenerOptions = {},
) {
  const targetElement = toRef(target)
  const eventList = Array.isArray(event) ? event : [event]
  const listenerList = Array.isArray(listener) ? listener : [listener]

  if (!targetElement.value) return noop

  watch(targetElement, (currentTarget, previousTarget) => {
    removeEventListeners(previousTarget, eventList, listenerList, options)
    addEventListeners(currentTarget, eventList, listenerList, options)
  })

  const stop = () => {
    removeEventListeners(targetElement.value, eventList, listenerList, options)
  }

  addEventListeners(targetElement.value, eventList, listenerList, options)

  return stop
}

function addEventListeners(
  targetElement: HTMLElement | Window,
  eventList: string[],
  listenerList: Function[],
  options: boolean | EventListenerOptions = {},
) {
  if (!targetElement) return
  eventList.forEach((event) => {
    listenerList.forEach((listener) => {
      targetElement.addEventListener(
        event as keyof HTMLElementEventMap,
        listener as EventListener,
        options,
      )
    })
  })
}

function removeEventListeners(
  targetElement: HTMLElement | Window,
  eventList: string[],
  listenerList: Function[],
  options: boolean | EventListenerOptions = {},
) {
  if (!targetElement) return
  eventList.forEach((event) => {
    listenerList.forEach((listener) => {
      targetElement.removeEventListener(
        event as keyof HTMLElementEventMap,
        listener as EventListener,
        options,
      )
    })
  })
}
