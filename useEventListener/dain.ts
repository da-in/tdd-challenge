import { computed, isRef, Ref, UnwrapRef, watchEffect } from 'vue-demi'
import { toRef, watch } from 'vue'

export const useEventListener = (target: HTMLElement | Ref<HTMLElement>, event, listener, options?) => {
  const _target = toRef(target)
  const _options = toRef(options)
  const _event = Array.isArray(event) ? event : [event]
  const _listener = Array.isArray(listener) ? listener : [listener]

  _event.forEach((e) => {
    _listener.forEach((l)=> _target.value.addEventListener(e, l, _options.value))
  })

  if(!_target.value){
    return ()=>{}
  }

  return () =>_event.forEach((e) => {
    _listener.forEach((l)=> _target.value.removeEventListener(e, l, _options.value))
  })
}
