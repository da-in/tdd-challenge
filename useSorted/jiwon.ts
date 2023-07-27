import { computed, ref } from 'vue'

const getDirtyOption = (args: any[]) => {
  if (args.length === 0) return false
  const lastArg = args[args.length - 1]
  if (typeof lastArg === 'object' && lastArg.dirty) {
    return lastArg.dirty
  }
  return false
}

const getSortFn = (args: any[]) => {
  const compareFn = (a:any, b:any) => a - b
  const firstArg = args[0]
  if (typeof firstArg === 'function') {
    return firstArg
  }
  if (typeof firstArg === 'object' && firstArg.compareFn) {
    return firstArg.compareFn
  }
  return compareFn
}

export const useSorted = (src: any[], ...args: any[]) => {
  const isDirty = getDirtyOption(args)
  const sortFn = getSortFn(args)
  const destRef = ref([...src])

  if (!isDirty) {
    destRef.value = destRef.value.sort(sortFn)
    return destRef
  }
  return computed(() => src.sort(sortFn))
}