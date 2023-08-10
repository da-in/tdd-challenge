import { MaybeRef, toValue } from 'vue-demi'

export const useSorted = (obj: MaybeRef<any[]>, ...args) => {
  const [customCompareFn, options] = typeof(args[0])==='function' ? args : [undefined, ...args]
  const arr = options?.dirty ? toValue(obj) : toValue(obj).slice()
  const compareFn = customCompareFn || options?.compareFn || ((a: any, b: any) => parseFloat(a) - parseFloat(b))
  arr.sort(compareFn)
  return arr
}
