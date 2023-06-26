import { Ref, reactive, ref } from "vue-demi"

export interface queueResult {
  activeIndex: Ref<number>,
  result: object[]
}

export async function useAsyncQueue(tasks: any[]) {
  const activeIndex = ref(-1)
  const result = reactive<object[]>([])
  let prev:any = null
  for (const task of tasks) {
    const res = await task(prev)
    activeIndex.value = result.length // ??
    result.push({state: 'fulfilled', data: res})
    prev = res
  }
  // console.log(activeIndex, result)
  // const res = tasks.reduce(async (previousPromise, fn) => {
  //   const previousResult = await previousPromise;
  //   const result = await fn(parseInt(previousResult));
  //   return [...previousResult, result];
  // }, Promise.resolve([]));
  // console.log(res)
  return {activeIndex, result}
}