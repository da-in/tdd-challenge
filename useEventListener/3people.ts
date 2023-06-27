import { onScopeDispose, ref, toRef, watch } from "vue"

export const noop = () => {}
export const useEventListener = (...args: any[]) => {
  let target: any, events: any, listeners: any, options: any

  if (typeof args[0] === 'string') {
    [events, listeners, options] = args
    target = window
  } else {
    [target, events, listeners, options] = args
  }

  const targetRef = toRef(target)

  if (!target) {
    return noop
  }
  
  if (!Array.isArray(events)) {
    events = [events]
  }
  if (!Array.isArray(listeners)) {
    listeners = [listeners]
  }

  const removeCandidate = ref([])
  const stop = () => {
    for (const removeFn of removeCandidate.value) {
      removeFn()
    }
    removeCandidate.value = []
  }
  
  watch(targetRef, (newValue) => {
    if (!newValue) {
      stop()
      return
    }
    for (const event of events) {
      for (const listener of listeners) {
        newValue.addEventListener(event, listener, options)
        removeCandidate.value.push(() => newValue.removeEventListener(event, listener, options))
      }
    }
  }, {immediate: true})

  onScopeDispose(stop)
  return stop
}