import { isRef, ref, Ref, watch } from 'vue-demi'

// data의 type을  T | Ref<T> | (() => T)로 정의하고,
// typeof data === 'function'일 때 data()와 같이 호출하면 타입스크립트 에러가 난다
// 관련 이슈 링크: https://github.com/microsoft/TypeScript/issues/37663
// typeof data === 'function'으로 type narrowing이 되지 않는 것 같다

interface UseClonedOptions{
  manual?: boolean
  clone?: any
  immediate?: boolean
  deep?: boolean
}

export const useCloned = <T>(data: T | Ref<T> | (() => T), options?: UseClonedOptions) => {

  const { manual, clone, immediate = true, deep = true } = options || {}

  const _clone = clone ? clone : (value: typeof data) => JSON.parse(JSON.stringify(value))

  const getClonedValue = () => {
    if (typeof data === 'function') {
      return _clone((data as () => T)())
    }
    else if (isRef(data)) {
      return _clone(data.value)
    }
    else {
      return _clone(data)
    }
  }

  const sync = () => {
    cloned.value = getClonedValue()
  }

  const cloned = ref<T>({} as T)

  if (immediate) {
    cloned.value = getClonedValue()
  }

  // data가 변경되면 cloned도 변경
  if (!manual && (isRef(data) || typeof data === 'function')){
      watch(data, (currentValue) => {
        cloned.value = getClonedValue()
      }, { deep })
    // reactive를 watch하면 deep: true가 기본값
    // getter function이나 ref 사용 시 deep: true 옵션을 줘야 deep watch가 됨
  }

  return { cloned, sync }
}
