export default defineEventHandler((event) => {
    return useServerAPI(event).get<[]>('/blank');
})