import { computed, ref, toRef } from "vue"

export function useCycleList(list: String[]){
  const listRef = toRef(list)
  const state = ref(listRef.value[0] ?? undefined)
  const index = computed({
    get: () => {
      let index = listRef.value.indexOf(state.value)
      if (index < 0) {
        index = 0
      } 
      return index
    },
    set: (n) => makeCycle(n)
  })

  const makeCycle = (n: number) => {
    const length = listRef.value.length
    const index = n % length
    const value = listRef.value[index]
    state.value = value
    return value 
  }

  const next = () => {
    makeCycle(index.value + 1)
  }

  const prev = () => {
    makeCycle(index.value - 1)
  }

  return {state, next, prev, index}
}