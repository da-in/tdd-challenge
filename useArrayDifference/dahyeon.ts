import { Ref, computed, ref } from 'vue-demi'

export const useArrayDifference = (
  list1: Ref<Array<any>>,
  list2: Ref<Array<any>>,
  keyOrfilterFunction?: Function | string | number,
) => {
  const result = computed(() => {
    if (keyOrfilterFunction === undefined) {
      return list1.value.filter((value) => !list2.value.includes(value))
    } else if (typeof keyOrfilterFunction === 'function') {
      return list1.value.filter((value1) => {
        return !list2.value.some((value2) => keyOrfilterFunction(value1, value2))
      })
    } else if (typeof keyOrfilterFunction === 'number' || typeof keyOrfilterFunction === 'string') {
      const key = keyOrfilterFunction
      return list1.value.filter((value1) => {
        return !list2.value.some((value2) => value1[key] === value2[key])
      })
    } else {
      return list1
    }
  })

  return result
}
