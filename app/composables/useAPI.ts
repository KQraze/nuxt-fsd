import type { InternalApi, NitroFetchRequest } from "nitropack";
import type { FetchError } from "ofetch";

type ApiError = FetchError<{
  statusCode: number;
  message: string;
}>;

// Берем только те маршруты, которые точно есть в InternalApi
type ApiRoute = Extract<NitroFetchRequest, keyof InternalApi>;

type UseApiOptions<DataT, ErrorT> = {
  useCache?: boolean;
} & Parameters<typeof useFetch<DataT, ErrorT>>[1];

export type ApiResponse<
  RequestT extends ApiRoute,
  MethodT extends keyof InternalApi[RequestT],
> = InternalApi[RequestT][MethodT];

export function useAPI<
  RequestT extends ApiRoute,
  MethodT extends keyof InternalApi[RequestT],
  DataT = ApiResponse<RequestT, MethodT>,
  ErrorT = ApiError,
>(
  url: RequestT | (() => RequestT),
  options: UseApiOptions<DataT, ErrorT> = {},
) {
  const useFetchReturn = useFetch<DataT, ErrorT>(url, {
    ...options,
    getCachedData(key, nuxtApp, { cause }) {
      if (cause === "refresh:manual") return;
      return nuxtApp.payload?.data?.[key] ?? nuxtApp.static?.data?.[key];
    },
  });

  return {
    ...useFetchReturn,
    isLoading: computed(() => useFetchReturn.status.value === "pending"),
  };
}

export function useLazyAPI<
  RequestT extends ApiRoute,
  MethodT extends keyof InternalApi[RequestT],
  DataT = ApiResponse<RequestT, MethodT>,
  ErrorT = ApiError,
>(
  url: RequestT | (() => RequestT),
  options: Omit<UseApiOptions<DataT, ErrorT>, "lazy"> = {},
) {
  return useAPI<RequestT, MethodT, DataT, ErrorT>(url, {
    ...options,
    lazy: true,
  });
}
