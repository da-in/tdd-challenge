import { computed, Ref } from 'vue-demi'

export function useArrayDifference(list1: Ref<any[]>, list2: Ref<any[]>, comparator?: string | ((v1: any, v2: any) => boolean)) {
    if (typeof list1 !== typeof list2) return computed(() => [])
    
    if (!comparator) return computed(() => list1.value.filter((v) => !list2.value.includes(v)))
    else if (typeof comparator === 'string') return computed(() => list1.value.filter((v1) => list2.value.every((v2) => !isDeepEqual(v1[comparator], v2[comparator]))))
    return computed(() => list1.value.filter((v1) => list2.value.every((v2) => !comparator(v1, v2))))
}

function isDeepEqual(obj1: any, obj2: any) {
    return JSON.stringify(obj1) === JSON.stringify(obj2)
}