interface Options {
  dirty?: boolean
  compareFn?: any
}

export const useSorted = (arr: any, compareFn?: any, options?: Options) => {
  const defaultFn = (a: any, b: any) => a - b
  if (options) {
    return arr.sort((a: any, b: any) => compareFn(a, b))
  } else {
    if (typeof compareFn === 'object') {
      return [...arr].sort((a, b) => compareFn.compareFn(a, b))
    } else {
      return compareFn ? [...arr].sort((a, b) => compareFn(a, b)) : [...arr].sort((a, b) => defaultFn(a, b))
    }
  }
}