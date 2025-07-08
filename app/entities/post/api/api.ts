export const useAll = () =>
  useAPI("posts", () => $fetch("/bff/posts"), { useCache: false });

export const useOne = (id: Ref<number>) =>
  useAPI(
    computed(() => `posts-${id.value}`),
    () => $fetch(`/bff/posts/${id.value}`),
  );
