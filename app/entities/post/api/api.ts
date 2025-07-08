export const useAll = () => useAPI("posts", () => $fetch("/bff/posts"));
export const useOne = (id: Ref<number>) => useAPI(() => `posts-${id.value}`, () => $fetch(`/bff/posts/${id.value}`));