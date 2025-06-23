export const getAll = () =>
  useFetch(() => "/bff/posts", { key: "posts" });
export const getOne = (id: string) =>
  useFetch(() => `/bff/posts/${id}`, cachedApiOptions({ key: `posts-${id}` }));
