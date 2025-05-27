import type { NitroFetchOptions, NitroFetchRequest } from "nitropack";

const rawApiFetch = $fetch.create({
  baseURL: useRuntimeConfig().public.apiUrl,
  onRequest({ options }) {
    const token = useCookie("token").value;
    if (token) {
      options.headers.set("Authorization", `Bearer ${token}`);
    }
  },
});

export const $api = {
  get(request: string, opts?: NitroFetchOptions<NitroFetchRequest>) {
    return rawApiFetch(request, { method: "GET", ...opts });
  },

  post(
    request: string,
    body: BodyInit | Record<string, any> | null | undefined,
    opts?: NitroFetchOptions<NitroFetchRequest>,
  ) {
    return rawApiFetch(request, { method: "POST", body, ...opts });
  },

  patch(
    request: string,
    body: BodyInit | Record<string, any> | null | undefined,
    opts?: NitroFetchOptions<NitroFetchRequest>,
  ) {
    return rawApiFetch(request, { method: "PATCH", body, ...opts });
  },

  put(
    request: string,
    body: BodyInit | Record<string, any> | null | undefined,
    opts?: NitroFetchOptions<NitroFetchRequest>,
  ) {
    return rawApiFetch(request, { method: "PUT", body, ...opts });
  },

  delete(request: string, opts?: NitroFetchOptions<NitroFetchRequest>) {
    return rawApiFetch(request, { method: "DELETE", ...opts });
  },
};
