import { ref } from 'vue-demi'

type PromiseQueueElement = (...args:any) => Promise<unknown>

export const useAsyncQueue = (promiseQueue: Array<PromiseQueueElement>,
                              {onFinished = undefined, onError = undefined, interrupt = true, signal = undefined} = {}) => {

  const activeIndex = ref<number>(0)
  const result = Array(promiseQueue.length).fill({
    state: 'pending',
    data: undefined
  })

  const isLastIndex = (index: number, array: Array<any>) => {
    return index === array.length - 1
  }



  const execute = (previousData: any = undefined) => {
    promiseQueue[activeIndex.value](previousData).then((data)=>{
      if (signal && signal.aborted){
        throw new Error('aborted')
      }
      result[activeIndex.value] = {
        state: 'fulfilled',
        data: data
      }
      if (isLastIndex(activeIndex.value, promiseQueue)) {
        if (onFinished) onFinished()
        return
      }
      activeIndex.value += 1
      execute(data)
    }).catch((error)=>{
      if (signal && signal.aborted){
        result[activeIndex.value] = {
          state: 'aborted',
          data: error
        }
        if (!isLastIndex(activeIndex.value, promiseQueue)){
          activeIndex.value++
        }
        return
      }
      result[activeIndex.value] = {
        state: 'rejected',
        data: error
      }
      if (onError) onError()
      if (interrupt || isLastIndex(activeIndex.value, promiseQueue)) {
        if (onFinished) onFinished()
        return
      }
      activeIndex.value += 1
      execute()
    })
  }

  execute()

  return {
    activeIndex,
    result,
  }
}
