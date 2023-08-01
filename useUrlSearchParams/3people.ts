import { reactive, watch } from "vue"

interface Options {
  initialValue?: object
}

export const useUrlSearchParams = (mode: string, options?: Options) => {
  const params = options?.initialValue ? reactive(options.initialValue) : reactive({})
  const splitParams = (paramArr: any[]) => {
    return paramArr.map((el) => {
      if (el.includes('=')) {
        const [key, value] = el.split('=')
        params[key] = value
      }
    })
  }
  if (mode === 'hash') {
    const hash = window.location.hash.split('?')
    // [ '#/test/', 'foo=bar' ]
    splitParams(hash)
  } else if (mode === 'hash-params') {
    const hashParams = window.location.hash.split('#').slice(1)
    splitParams(hashParams)
  } else {
    const search = window.location.search.split('?').slice(1)
    splitParams(search)
  }

  const makeQuery = () => {
    const urlSearchParams = new URLSearchParams('')
    Object.keys(params).map((el) => {
      // 하나의 key에 2개 이상의 value가 들어올 때 (array search param)
      if (Array.isArray(params[el])) {
        params[el].map((values: string) => {
          urlSearchParams.append(el, values)
        })
      } else {
        urlSearchParams.append(el, params[el])
      }
    })
    const stringified = urlSearchParams.toString()
    if (mode === 'hash') {
      const hash = window.location.hash || '#'
      const index = hash.indexOf('?')
      if (index > 0) {
        return `${hash.slice(0, index)}${stringified ? `?${stringified}` : ''}`
      }
      return `${hash}${stringified ? `?${stringified}` : ''}`
    } else if (mode === 'hash-params') {
      // 앞에 path 붙혀주고 param 있으면 # 붙혀서 리턴
      return `${window.location.search || ''}${stringified ? `#${stringified}` : ''}`
    } else {
      // param 있으면 ? 붙히고 뒤에 hash도 있으면 붙혀서 리턴
      return `${stringified ? `?${stringified}` : ''}${window.location.hash || ''}`
    }
  }

  watch(params, () => {
    window.history.replaceState(
      null,
      window.document.title,
      window.location.pathname + makeQuery(),
    )
  })

  // 몰루?
  const onStateChanged = () => {
    window.history.replaceState(
      null,
      window.document.title,
      window.location.pathname + makeQuery(),
    )
  }
  window.addEventListener('popstate', onStateChanged)
  return params
}