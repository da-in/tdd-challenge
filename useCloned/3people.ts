import { MaybeRefOrGetter, isRef, ref, toValue, watch } from "vue"

interface UseClonedOptions {
  manual?: boolean
  clone?: (source: any) => any
  deep?: boolean
  immediate?: boolean
}

export const useCloned = (data: MaybeRefOrGetter, options?: UseClonedOptions) => {
  const { 
    manual = false, 
    clone = (source: any) => ({ ...source }), 
    deep = true, 
    immediate = true 
  } = options || {}

  const cloned = ref({})
  const sync = () => {
    // toValue는 getter도 처리해준다
    cloned.value = clone(toValue(data))
  }

  if (!manual && (isRef(data) || typeof data === 'function')) {
    watch(data, sync, { deep, immediate })
  } else {
    sync()
  }

  return { cloned, sync }
}