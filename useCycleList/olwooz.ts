import { computed, Ref, toRef } from "vue-demi"

export function useCycleList(array: any[] | Ref<any[]>) {
    const arrayRef = toRef(array)
    const state = toRef(arrayRef.value[0] ?? undefined)
    const index = computed({
        get() {
            const currentIndex = arrayRef.value.indexOf(state.value)
            return isIndexWithinRange(currentIndex) ? currentIndex : 0
        },
        set(newIndex: number) {
            if (!isIndexWithinRange(newIndex)) newIndex = 0
            state.value = arrayRef.value[newIndex]
            return newIndex
        }
    })

    const next = () => {
        index.value++
    }

    const prev = () => {
        if (index.value === 0) index.value = arrayRef.value.length - 1
        else index.value--
    }

    const isIndexWithinRange = (index: number) => {
        return index >= 0 && index < arrayRef.value.length
    }

    return {state, next, prev, index}
}