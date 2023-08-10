// Javascript의 내장 sort 메소드는 요소를 string으로 변환해서 비교한다.

interface UseSortedOptions<T> {
  dirty?: boolean
  compareFn?: (a: T, b: T) => number
}

export const useSorted = <T>(
  arr: Array<T>,
  sortFn: (a: T, b: T) => number,
  { dirty, compareFn }: UseSortedOptions<T> = {},
) => {
  if (typeof sortFn === 'object') {
    const options = sortFn as UseSortedOptions<T>
    dirty = options.dirty
    compareFn = options.compareFn
    sortFn = undefined
  }

  const _arr = dirty ? arr : [...arr]

  if (sortFn) return _arr.sort(sortFn)
  if (compareFn) return _arr.sort(compareFn)

  return _arr.sort((a: T, b: T) => {
    if (a < b) return -1
    if (a > b) return 1
    return 0
  })
}
