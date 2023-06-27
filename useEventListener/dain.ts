import { toRef, watch, Ref } from 'vue'
import { Fn, noop } from '@vueuse/shared'

export const useEventListener = (target: HTMLElement | Ref<HTMLElement>, event, listener, options?) => {
  const _target = toRef(target)
  const _options = toRef(options)
  const _event = Array.isArray(event) ? event : [event]
  const _listener = Array.isArray(listener) ? listener : [listener]

  watch([_target, _options], ([curTarget, curOptions], [prevTarget, prevOptions]) =>{
    if(prevTarget instanceof HTMLElement){
      _event.forEach((e) => {
        _listener.forEach((l)=> prevTarget.removeEventListener(e, l, prevOptions))
      })
    }
    if(curTarget instanceof HTMLElement){
      _event.forEach((e) => {
        _listener.forEach((l)=> curTarget.addEventListener(e, l, curOptions))
      })
    }
  }, {immediate: true})

  if(!(_target.value instanceof HTMLElement)){
    return noop
  }

  return () =>_event.forEach((e) => {
    _listener.forEach((l)=> _target.value.removeEventListener(e, l, _options.value))
  })
}
