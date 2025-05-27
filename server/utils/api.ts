import type { H3Event } from "h3";
import type { NitroFetchOptions } from "nitropack";

export const useServerAPI = (event: H3Event) => {
  const fetchInstance = $fetch.create({
    baseURL: useRuntimeConfig().public.apiUrl,
    onRequest({ options }) {
      const token = getCookie(event, "token");
      if (token) {
        options.headers.set("Authorization", `Bearer ${token}`);
      }
    },
  });

  return {
    get: <T>(request: string, opts?: NitroFetchOptions<string>) =>
      fetchInstance<T>(request, opts),
    post: <T>(
      request: string,
      body?: BodyInit | Record<string, any> | null,
      opts?: NitroFetchOptions<string>,
    ) => fetchInstance<T>(request, { method: "POST", body, ...opts }),
    patch: <T>(
      request: string,
      body?: BodyInit | Record<string, any> | null,
      opts?: NitroFetchOptions<string>,
    ) => fetchInstance<T>(request, { method: "PATCH", body, ...opts }),
    put: <T>(
      request: string,
      body?: BodyInit | Record<string, any> | null,
      opts?: NitroFetchOptions<string>,
    ) => fetchInstance<T>(request, { method: "PUT", body, ...opts }),
    delete: <T>(request: string, opts?: NitroFetchOptions<string>) =>
      fetchInstance<T>(request, { method: "DELETE", ...opts }),
  };
};
