export interface UseMemoizeCache<Key, Value> {
  /**
   * Get value for key
   */
  get (key: Key): Value | undefined
  /**
   * Set value for key
   */
  set (key: Key, value: Value): void
  /**
   * Return flag if key exists
   */
  has (key: Key): boolean
  /**
   * Delete value for key
   */
  delete (key: Key): void
  /**
   * Clear cache
   */
  clear (): void
}

export function useMemoize<T extends (...args: any[]) => any>(resolver: Function, options?: { getKey?: Function; cache?: any }) {
  const cache = new Map()
  const memo = (...args: Parameters<T>) => {
    const key = options?.getKey ? options.getKey(args[0]) : JSON.stringify(args)
    if (options?.cache) {
      if (!options?.cache.has(key))
        options.cache.set(key, resolver(...args))

      return options.cache.get(key)
    }
    else {
      if (cache.has(key))
        return cache.get(key)

      const result = resolver(...args)
      cache.set(key, result)
      return result
    }
  }
  memo.clear = () => {
    if (options?.cache)
      options.cache.clear()

    cache.clear()
  }
  memo.delete = (...args: Parameters<T>) => {
    const key = options?.getKey ? options.getKey(args[0]) : JSON.stringify(args)
    if (options?.cache)
      options.cache.delete(key)

    cache.delete(key)
  }
  memo.load = (...args: Parameters<T>) => {
    if (options?.cache) {
      const key = options?.getKey ? options.getKey(args[0]) : JSON.stringify(args)
      options.cache.set(key, resolver(...args))
      return options.cache.get(key)
    }
    const result = resolver(...args)
    return result
  }
  return memo
}
