import { isRef } from 'vue'
import { noop } from './index.test'

const normalizeToArray = (value: any) => {
  if (Array.isArray(value)) return value
  else return [value]
}

const isValidTarget = (target: any) => {
  if (isRef(target) || !target) return false
  return true
}

export const useEventListener = (target: any, event: any, listener: any, options?: any) => {
  const events = normalizeToArray(event)
  const listeners = normalizeToArray(listener)


  if (typeof target === 'string') {
    return useEventListener(window, target, event, listener)
  }

  if (isValidTarget(target)) {
    events.forEach(event =>
      listeners.forEach(listener => target.addEventListener(event, listener, options))
    )
    return () => {
      events.forEach(event =>
        listeners.forEach(listener => target.removeEventListener(event, listener, options))
      )
    }
  } else {
    return noop
  }

}