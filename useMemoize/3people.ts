import { reactive } from "vue"


/**
 * * options에서 필요해서 가져옴
 */
export interface UseMemoizeCache<Key, Value> {
  /**
   * Get value for key
   */
  get(key: Key): Value | undefined
  /**
   * Set value for key
   */
  set(key: Key, value: Value): void
  /**
   * Return flag if key exists
   */
  has(key: Key): boolean
  /**
   * Delete value for key
   */
  delete(key: Key): void
  /**
   * Clear cache
   */
  clear(): void
}

export const useMemoize = (func: Function, options?: any) => {
  const cache = options?.cache ? reactive(options.cache) : reactive(new Map())
  const makeKey = (...args: any) => {
    // options에 getKey가 있다면 getKey 없다면 stringify로 키를 만들어줌
    // args.toString()으로 구현했는데 options cache가 안됨 key를 [1] 이따구로 줘서
    // 그래서 JSON.stringify를 써야 되는데 쓰면 난리가 남
    return options?.getKey ? options.getKey(...args) : JSON.stringify(args)
  }

  const get = (key: any, ...args: any) => {
    // load 호출 시 항상 func를 호출해야 되기 때문에 이렇게 만듬.. 이게 맞나? 왜 돌아감
    args.length ? cache.set(key, func(...args)) : cache.set(key, func(key))
    return cache.get(key)
  }

  const load = (...args: any) => {
    // load는 key는 stringify하고 value는 그대로 들어가야 함
    const _key = makeKey(...args)
    cache.set(_key, func(...args))
    return cache.get(_key)
  }

  const myDelete = (key: any) => {
    cache.delete(makeKey(key))
  }

  const clear = () => {
    cache.clear()
  }

  const result = (...args: any) => {
    const key = makeKey(...args)
    if (cache.has(key)) {
      return cache.get(key)
    }
    return get(key, ...args)
  }

  result.load = load
  result.clear = clear
  result.delete = myDelete

  return result
}