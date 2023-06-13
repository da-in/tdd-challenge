import { computed, MaybeRef, toRef, ref, isRef, UnwrapRef } from 'vue-demi'

// watch 왜 안되지
export function useCycleList<T>(list: MaybeRef<T[]>) {
  const listRef = toRef(list)
  const state = ref(isRef(list) ? list.value[0] : list[0])
  const index = computed<number>({
    get() {
      if (state.value === undefined) {
        return 0
      }
      return listRef.value.indexOf(state.value as any)
    },
    set(v) {
      const length = listRef.value.length
      state.value = listRef.value[((v % length) + length) % length] as UnwrapRef<T>
    },
  })

  function next() {
    index.value += 1
  }

  function prev() {
    index.value -= 1
  }

  return { state, index, next, prev }
}
