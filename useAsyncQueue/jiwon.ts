import { reactive, ref, Ref } from 'vue-demi'


interface UseAsyncQueueOptions {
  onError?: (error: Error) => void
  onFinished?: () => void
  interrupt?: boolean
  signal?: AbortSignal
}

interface UseAsyncQueueReturn<T> {
  activeIndex: Ref<number | undefined>
  result: Object[],
}

interface UseAsyncQueue {
  <T>(list: Function[], options?: UseAsyncQueueOptions): UseAsyncQueueReturn<T>
}

export interface UseAsyncQueueResult<T> {
  state: 'aborted' | 'fulfilled' | 'pending' | 'rejected'
  data: T | null
}

export const useAsyncQueue: UseAsyncQueue = (taskList, options) => {
  const activeIndex = ref<number | undefined>(undefined)
  const result = reactive([])
  taskList.reduce((prev, curr) => {
    prev.then((prevResult) => {
    })
    return prev // TODO: 추후 제거
  }, Promise.resolve())
  return {
    activeIndex,
    result,
  }
}