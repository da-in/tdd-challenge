export type useMemoize = (resolver: () => void) => void

export interface UseMemoizeCache<T, S> {
  get: (key: T) => S
  set: (key: T, value: S) => void
  has: (key: T) => boolean
  delete: (key: T) => void
  clear: () => void
}

export const useMemoize = <T, S>(
  resolver: (...args: any) => S,
  { getKey: getCustomKey, cache }: { getKey?: Function; cache?: UseMemoizeCache<T, S> } = {},
) => {
  const cacheMap = {}

  const getKey = (args: any) => {
    return getCustomKey ? getCustomKey(args) : JSON.stringify(args)
  }

  const executor = (...args: any) => {
    const key = getKey(args)

    if (cache && cache.has(key)) {
      return cache.get(key)
    }

    if (!cache && key in cacheMap) {
      return cacheMap[key]
    }

    return _load(...args)
  }

  const _load = (...args: any) => {
    const key = getKey(args)
    const result = resolver(...args)

    cacheMap[key] = result

    if (cache) {
      cache.set(key, result)
      return cache.get(key)
    }

    return result
  }

  const _delete = (...args: any) => {
    const key = getKey(args)

    if (cache) cache.delete(key)
    delete cacheMap[key]
  }

  const _clear = () => {
    if (cache) cache.clear()
    Object.keys(cacheMap).forEach((key) => {
      delete cacheMap[key]
    })
  }

  executor.load = _load
  executor.delete = _delete
  executor.clear = _clear

  return executor
}
