export default defineCachedEventHandler(
  (event) => {
    return useServerAPI(event).get<Post[]>("posts");
  },
  {
    maxAge: 3600,
  },
);
