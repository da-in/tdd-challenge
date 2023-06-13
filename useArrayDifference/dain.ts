import { computed, Ref } from 'vue-demi'

export function useArrayDifference<T, U = T>(
  list1: Ref<T[]>,
  list2: Ref<T[]>,
  compare: string | ((value: any, othVal: any) => boolean) = (value, othVal) => {
    return value === othVal
  },
) {
  const result = computed(() => {
    const compareFunction =
      typeof compare === 'string'
        ? (value, othVal) => {
            if (value[compare] == undefined || othVal[compare] == undefined) {
              return false
            }
            return value[compare] === othVal[compare]
          }
        : compare
    return list1.value.filter((value) => {
      return !list2.value.some((othVal) => {
        return compareFunction(value, othVal)
      })
    })
  })

  return result
}
