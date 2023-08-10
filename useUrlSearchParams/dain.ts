import { reactive } from 'vue-demi'
import { watch } from 'vue'

interface Options {
  initialValue?: any
  window?: Window
  write?: boolean
}

export const useUrlSearchParams = (mode: string, options?: Options) : any => {
  const params = reactive(options?.initialValue || {})
  const queryString = mode==='history' ? window.location.search : window.location.hash.split('?')[1]

  const updateParams = () => {
    const queryString = mode === 'history' ? window.location.search : window.location.hash.split('?')[1]
    const urlSearchParams = new URLSearchParams(queryString)
    for (const [key, value] of urlSearchParams) {
      if(params[key]){
        params[key] = [params[key], value]
      } else {
        params[key] = value
      }
    }
  }

  const updateUrl = () => {
    window.history.replaceState(null, '', `/${mode==='history' ? '?' : '#'}${new URLSearchParams(params).toString()}`)
  }

  const handlePopState = () => {
    if(options?.write===false) return
    Object.keys(params).forEach(key => delete params[key])
    updateParams()
  }

  if(window) {
    window.addEventListener('popstate', handlePopState)
  }

  watch(params, updateUrl);

  updateParams()

  return params
}
