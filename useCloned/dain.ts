import { ref, toRef, watch } from 'vue'
import { MaybeRef } from 'vue-demi'

interface Options {
  manual?: boolean
  immediate?: boolean
  deep?: boolean
  clone?: Function
}

export const useCloned = <T>(data: MaybeRef<T>, {deep=true, immediate=true, manual, clone=((v)=>{return v})}: Options = {} ) => {
  const dataRef= toRef(data)
  const clonedRef = ref({} as T)
  const sync = () => {
    clonedRef.value = clone(JSON.parse(JSON.stringify(dataRef.value)))
  }

  !manual && watch(dataRef, ()=> {
    sync()
  }, {deep, immediate})

  return {cloned: clonedRef, sync}
}
