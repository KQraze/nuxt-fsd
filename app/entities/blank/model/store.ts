export const useStore = defineStore('blank', () => {
    const { getBlank } = blankEntity;

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