import { computed, toValue } from "vue"

export function useArrayDifference<T>(...args: any[]) {
  let val1 = toValue(args[0])
  let val2 = toValue(args[1])
  let defaultComp = (val1: T, val2: T) => val1 === val2
  let comp = args[2] ?? defaultComp
  
  if (typeof comp === 'string') {
    const key = comp as keyof T
    comp = (val1: T, val2: T) => val1[key] === val2[key]
  }

  let diff = val1.filter((el1: any) => val2.findIndex((el2: any) => comp(el1, el2)) === -1)
  return computed(() => diff)
}