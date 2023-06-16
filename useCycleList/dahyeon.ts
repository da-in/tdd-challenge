import { Ref, computed, isRef, ref } from 'vue-demi'

//watch 사용 시 test 통과 안 됨 :(
//   watch(state, (newState, prevState) => {
//     if (newState === prevState) return
//     const newIndex = _list.value.indexOf(newState)
//     index.value = newIndex
//   })

export const useCycleList = (list: Ref<Array<any>> | Array<any>) => {
  const _list = isRef(list) ? list : ref(list)

  const _index = ref(0)

  const index = computed({
    get: () => {
      if (_list.value.length < _index.value) {
        _index.value = 0
      }
      return _index.value
    },
    set: (val) => {
      if (_list.value.length > val) {
        _index.value = val
      }
    },
  })

  const state = computed({
    get: () => {
      return _list.value[_index.value]
    },
    set: (val) => {
      _index.value = _list.value.indexOf(val)
    },
  })

  const length = computed(() => {
    return _list.value.length
  })

  const next = () => {
    if (index.value === length.value - 1) index.value = 0
    else index.value = index.value + 1
  }

  const prev = () => {
    if (index.value == 0) index.value = length.value - 1
    else index.value = index.value - 1
  }

  return {
    state,
    next,
    prev,
    index,
  }
}
