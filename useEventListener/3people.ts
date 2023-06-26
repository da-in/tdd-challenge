import { onScopeDispose, ref, toRef, watchEffect } from "vue"

export const useEventListener = (...args: any[]) => {
  let target: any
  let events: any
  let listeners: any
  let options: any
  if (typeof args[0] === 'string') {
    [events, listeners, options] = args
    target = window
  } else {
    [target, events, listeners, options] = args
  }
  const targetRef = toRef(target)

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

  watchEffect(() => {
    // 이거 안돼요 부수고 싶음 ㅠ
    if (!targetRef.value) return
    for (const event of events) {
      for (const listener of listeners) {
        targetRef.value.addEventListener(event, listener, options)
        removeCandidate.value.push(() => targetRef.value.removeEventListener(event, listener, options))
      }
    }
  })

  onScopeDispose(stop)
  return stop
}