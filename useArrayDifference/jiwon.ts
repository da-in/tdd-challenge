import { computed } from 'vue-demi'

export function useArrayDifference(srcRef: any, desctRef: any, ...args: any[]) {
  if (!args.length)
    return computed(() => srcRef.value.filter((item: any) => !desctRef.value.includes(item)))
  if (typeof args[0] === 'string') {
    const key = args[0]
    return computed(() => srcRef.value.filter((item: any) => !desctRef.value.some((desctItem: any) => desctItem[key] === item[key])))
  }
  else {
    const iteratee = args[0]
    return computed(() => srcRef.value.filter((item: any) => !desctRef.value.some((desctItem: any) => iteratee(item, desctItem))))
  }
}
