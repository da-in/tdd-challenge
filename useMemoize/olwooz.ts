import { ref } from "vue"

export const useMemoize = (resolver: (args) => {}) => {
    const cache = ref({})

    const memo = (args) => {
        if (cache.value[args]) return cache.value[args]
        return memo.load(args)
    }

    memo.load = (args) => {
        const result = resolver(args)
        cache.value[args] = result
        return result
    }

    memo.clear = () => {
        cache.value = {}
    }

    memo.delete = (args) => {
        cache.value[args] = null
    }

    return memo
}