import { ref, toRef, watch } from 'vue'
import { computed, MaybeRef } from 'vue-demi'

interface Options {
  manual?: boolean
  immediate?: boolean
  deep?: boolean
  clone?: Function
}

export const useCloned = (data: MaybeRef, options?: Options) => {
  const dataRef = toRef(data)
  const initialValue = options?.immediate === false ? {} : options?.manual ? JSON.parse(JSON.stringify(dataRef.value)) : dataRef.value
  const cloneFn = options?.clone || ((data)=>{return data})
  const cloned = typeof dataRef.value === 'function' ? computed(()=>dataRef.value()) : ref(cloneFn(initialValue))
  const sync = () => {
    cloned.value = dataRef.value
  }

  watch(data, ()=> {
    sync()
  }, {deep: options?.deep, immediate: options?.immediate})

  return {cloned, sync}
}
