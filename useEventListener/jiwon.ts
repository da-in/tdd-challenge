import { getCurrentScope, onScopeDispose, toRef, watch } from 'vue'
import { noop } from './index.test'

const normalizeToArray = (value: any) => {
  if (Array.isArray(value)) return value
  else return [value]
}

const isTargetWindow = (target: any) => {
  return typeof target === 'string'
}

export const useEventListener = (target: any, event: any, listener: any, options?: any) => {
  const events = normalizeToArray(event)
  const listeners = normalizeToArray(listener)
  const targetRef = toRef(target)
  const optionsRef = toRef(options)

  const addEventListener = () => {
    events.forEach(event => {
      listeners.forEach(listener => {
        targetRef.value.addEventListener(event, listener, optionsRef.value)
      })
    })
  }

  const removeEventListener = () => {
    events.forEach(event => {
      listeners.forEach(listener => {
        targetRef.value.removeEventListener(event, listener, optionsRef.value)
      })
    })
  }

  watch(targetRef, (target, prevTarget) => {
    if (!target) {
      prevTarget.removeEventListener(event, listener, optionsRef.value)
    }
    useEventListener(target, event, listener, options)
  })

  watch(optionsRef, (options, prevOptions) => {
    useEventListener(target, event, listener, options)
  })

  if (isTargetWindow(targetRef.value)) {
    return useEventListener(window, target, event, listener)
  }

  if (targetRef.value) {
    addEventListener()
    if (getCurrentScope()) {
      onScopeDispose(() => {
        if (typeof targetRef.value === 'string') window.removeEventListener(event, listener, optionsRef.value)
        else removeEventListener()
      })
      return
    }
    return removeEventListener
  } else {
    return noop
  }
}