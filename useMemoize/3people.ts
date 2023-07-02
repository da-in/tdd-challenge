import { reactive } from "vue"

export const useMemoize = (func: Function) => {
  const cache = reactive(new Map())
  const generateKey = (...args: any) => {
    return args.toString()
  }

  const load = (key: any, ...args: any) => {
    cache.set(key, func(...args))
    return cache.get(key)
  }

  const result = (...args: any) => {
    const key = generateKey(...args)
    if (cache.has(key)) {
      return cache.get(key)
    }
    return load(key, ...args)
  }

  return result
}