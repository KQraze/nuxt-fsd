export default defineCachedEventHandler((event) => {
  const id = getRouterParam(event, "id")
  return useServerAPI(event).get<Post>(`posts/${id}`);
}, useRuntimeConfig().cacheSettings);
