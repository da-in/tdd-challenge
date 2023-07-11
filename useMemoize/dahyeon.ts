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
  const resultsMap = {}

  const getKey = (args: any) => {
    return getCustomKey ? getCustomKey(args) : JSON.stringify(args)
  }

  const setCache = (key: T, result: S) => {
    if (cache) cache.set(key, result)
  }

  const executor = (...args: any) => {
    const key = getKey(args)

    if (cache) {
      if (!cache.has(key)) {
        return _load(...args)
      }
      return cache.get(key)
    }

    if (key in resultsMap) {
      return resultsMap[key]
    }

    return _load(...args)
  }

  const _load = (...args: any) => {
    const key = getKey(args)
    const result = resolver(...args)

    resultsMap[key] = result
    setCache(key, result)

    if (cache) return cache.get(key)

    return result
  }

  const _delete = (...args: any) => {
    const key = getKey(args)

    if (cache) cache.delete(key)
    delete resultsMap[key]
  }

  const _clear = () => {
    if (cache) cache.clear()
    Object.keys(resultsMap).forEach((key) => {
      delete resultsMap[key]
    })
  }

  executor.load = _load
  executor.delete = _delete
  executor.clear = _clear

  return executor
}
