export interface MemoizeCache<Key, Value> {
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

export const useMemoize = (resolver: Function , option?: { cache?: MemoizeCache<any, any>, getKey?: Function }) => {
  const cache = new Map();

  const memo = (...args) => {
    const key = getKey(args)
    if (!has(key)) {
      set(key, resolver(...args))
    }
    return get(key)
  }

  const getKey = (args) => {
    if(option?.getKey!==undefined){
      return JSON.stringify(option.getKey(args))
    }
    return JSON.stringify(args)
  }

  const get = (key: string) => {
    if(option?.cache){
      return option.cache.get(key)
    }
    return cache.get(key)
  }

  const has = (key: string) =>{
    if(option?.cache){
      return option.cache.has(key)
    }
    return cache.has(key)
  }

  const set = (key: string, value) => {
    if(option?.cache){
      return option.cache.set(key, value)
    }
    cache.set(key, value)
  }

  memo.delete = (...args) => {
    const key = JSON.stringify(args)
    cache.delete(key)
    if(option){
      option.cache.delete(key)
    }
  }

  memo.clear = ()=> {
    cache.clear()
    if(option){
      option.cache.clear()
    }
  }

  memo.load = (...args) => {
    const key = JSON.stringify(args)
    const result = resolver(...args)
    set(key, result)
    return get(key)
  }

  return memo
}
