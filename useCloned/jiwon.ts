import { ref, toValue, watch } from "vue"

type Options = {
  immediate?: boolean
  deep?: boolean
  manual?: boolean
  clone?: (value: any) => any
}

export const useCloned = (source:object, options?:Options) => {
  const cloned = ref(toValue(source))
  const originSource = JSON.parse(JSON.stringify(toValue(source)))

  const sync = () => {
    cloned.value = toValue(source)
  }

  if (options?.manual) {
    cloned.value = originSource
  }


  return {cloned, sync}
}