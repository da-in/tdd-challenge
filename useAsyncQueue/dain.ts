import { ref } from 'vue-demi'

interface Options {
  onFinished?: () => {}
  onError?: () => {}
  interrupt?: boolean
  signal?: AbortSignal
}

interface Result {
  state: 'fulfilled' | 'aborted'
  data: any
}

export const useAsyncQueue = (
  taskList: ((result?: number) => Promise<unknown>)[],
  options?: Options,
) => {
  const activeIndex = ref<number>(0)
  const result = []

  taskList.map(async (cur, index) => {
    try {
      activeIndex.value = index
      await cur().then((res) => {
        result.push({ state: 'fulfilled', data: res })
      })
    } catch (error) {
      result.push({ state: 'aborted', data: new Error('aborted') })
      if (options?.onError) {
        options.onError()
      }
      if (options?.interrupt !== false) {
        throw error
      }
    }

    if (index === taskList.length - 1 && options?.onFinished) {
      options.onFinished()
    }
  })

  return { activeIndex, result }
}
