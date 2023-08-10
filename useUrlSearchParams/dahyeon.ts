import { reactive, watch } from 'vue'

type Mode = 'history' | 'hash' | 'hash-params'
interface UseUrlSearchParamsOptions {
  initialValue?: Record<string, string>
  write?: boolean
}

const isArray = <T>(value: T | Array<T>): value is Array<T> => {
  if (Array.isArray(value)) return true
  return false
}

export const useUrlSearchParams = (
  mode: Mode,
  { initialValue, write = true }: UseUrlSearchParamsOptions = {},
) => {
  const params = reactive<Record<string, string | Array<string>>>({})

  const parseParams = () => {
    for (const key in params) {
      delete params[key]
    }

    let paramsStr = null
    let matchedStr = null

    switch (mode) {
      case 'history':
        matchedStr = window.location.search.match(/(?<=\?).*/)
        break
      case 'hash-params':
        matchedStr = window.location.hash.match(/(?<=#).*/)
        break
      case 'hash':
        matchedStr = window.location.hash.match(/(?<=\?).*/)
        break
    }

    if (!matchedStr) {
      return
    }
    paramsStr = matchedStr[0]

    paramsStr.split('&').forEach((el: string) => {
      const [key, val] = el.split('=')

      const currentVal = params[key]
      if (!currentVal) {
        params[key] = val
        return
      }

      if (isArray(currentVal)) {
        params[key] = [...currentVal, val]
      } else params[key] = [currentVal, val]
    })
  }

  if (initialValue) {
    for (const [key, value] of Object.entries(initialValue)) {
      params[key] = value
    }
  } else parseParams()

  window.addEventListener('popstate', () => {
    if (!write) return
    else parseParams()
  })

  watch(params, () => {
    const prefixMap = {
      history: '/',
      'hash-params': '/',
      hash: '/#',
    }

    let prefix = prefixMap[mode]

    const queryList = []
    for (const [key, value] of Object.entries(params)) {
      if (isArray(value)) {
        value.forEach((val) => queryList.push(`${key}=${val}`))
      } else queryList.push(`${key}=${value}`)
    }

    if (queryList.length > 0) {
      if (mode === 'hash-params') prefix += '#'
      else prefix += '?'
    }

    window.history.replaceState(null, '', prefix + queryList.join('&'))
  })

  return params
}
