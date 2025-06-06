import { getBlank } from '../api'

export const useStore = defineStore('blank', () => {
    /** use api refs */
    const blank = getBlank.getRef([])

    /** use api hooks */
    getBlank.onSuccess((data) => {
        // you logic
    })

    return {
        blank
    }
})