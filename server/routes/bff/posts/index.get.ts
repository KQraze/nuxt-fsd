export default defineCachedEventHandler((event) => {
  return useServerAPI(event).get<Post[]>("posts");
}, useRuntimeConfig().cacheSettings);
