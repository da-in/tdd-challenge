import { onScopeDispose, toRef, toValue, watchEffect } from "vue"

const destructureArguments = (args: any[]) => {
    const _args = typeof args[0] === 'string' ? [window, ...args] : [...args]

    return {target: _args[0], event: _args[1], listener: _args[2], options: _args[3] ?? null}
}

export const noop = () => {}

export const useEventListener = (...args: any[]) => {
    const {target, event, listener, options} = destructureArguments(args)
    if (!target) return noop
    
    const targetRef = toRef(target)
    const optionsRef = toRef(options)

    const events = typeof event === 'string' ? [event] : [...event]
    const listeners = typeof listener === 'function' ? [listener] : [...listener]
    
    let removeEventListenerList = []
    
    const remove = () => {
        removeEventListenerList.forEach(fn => fn())
        removeEventListenerList = []
    }

    watchEffect(() => {
        remove()
        if (!targetRef.value) return

        const targetElement = toValue(targetRef)
        const optionsObject = toValue(optionsRef)

        listeners.forEach((listener) => {
            events.forEach((event) => {
                targetElement.addEventListener(event, listener, optionsObject)
                removeEventListenerList.push(() => targetElement.removeEventListener(event, listener, optionsObject))
            })
        })
    })

    onScopeDispose(remove)
    return remove
}