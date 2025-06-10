import { getPosts } from "../api";

export const postsQuery = () => createQuery("posts", getPosts, {
  onSuccess: (data) => console.log(data)
});
