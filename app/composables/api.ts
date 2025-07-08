import type { AsyncDataOptions, AsyncData } from "#app";
import type { SubscribeEvent } from "~/shared";

import { isRef } from "vue";

export type UseApiOptions<DataT> = AsyncDataOptions<DataT> & {
  onSuccess?: EventHandler<DataT>;
  onError?: EventHandler<any>;
  onFinally?: EventHandler<undefined>;
  useCache?: boolean;
};

export type UseApiReturn<DataT, ErrorT> = AsyncData<DataT, ErrorT> & {
  isLoading: ComputedRef<boolean>;
  onSuccess: SubscribeEvent<DataT>;
  onError: SubscribeEvent<any>;
  onFinally: SubscribeEvent<undefined>;
};

export function useAPI<DataT, ErrorT = Error>(
  handler: () => Promise<DataT>,
  options?: UseApiOptions<DataT>,
): UseApiReturn<DataT, ErrorT>;

export function useAPI<DataT, ErrorT = Error>(
  key: string,
  handler: () => Promise<DataT>,
  options?: UseApiOptions<DataT>,
): UseApiReturn<DataT, ErrorT>;

export function useAPI<DataT, ErrorT = Error>(
  keyOrHandler:
    | string
    | Ref<string>
    | ComputedRef<string>
    | (() => Promise<DataT>),
  handlerOrOptions: (() => Promise<DataT>) | UseApiOptions<DataT> = {},
  maybeOptions?: UseApiOptions<DataT>,
): UseApiReturn<DataT, ErrorT> {
  const isKeyProvided = typeof keyOrHandler === "string" || isRef(keyOrHandler);

  const key = isKeyProvided ? keyOrHandler : undefined;
  const handler = isKeyProvided
    ? (handlerOrOptions as () => Promise<DataT>)
    : (keyOrHandler as () => Promise<DataT>);
  const options = isKeyProvided
    ? (maybeOptions ?? {})
    : (handlerOrOptions as UseApiOptions<DataT>);

  const successHook = createEventHook<DataT>();
  const errorHook = createEventHook<ErrorT>();
  const finallyHook = createEventHook<undefined>();

  if (options.onSuccess) successHook.on(options.onSuccess);
  if (options.onError) errorHook.on(options.onError);
  if (options.onFinally) finallyHook.on(options.onFinally);

  const wrappedHandler = async () => {
    try {
      const data = await handler();
      if (!options.transform) successHook.trigger(data as DataT);
      return data;
    } catch (e) {
      errorHook.trigger(e as ErrorT);
      throw e;
    } finally {
      finallyHook.trigger(undefined);
    }
  };

  const finalOptions: AsyncDataOptions<DataT> = {
    ...options,
    transform(data) {
      if (options.transform) {
        const transformed = options.transform(data);
        successHook.trigger(transformed as DataT);
        return transformed as DataT;
      }
      return data;
    },
    getCachedData(key, nuxtApp, { cause }) {
      if (cause === "refresh:manual") return;

      if (options?.useCache) {
        return useNuxtData(key).data.value;
      }

      return nuxtApp.isHydrating
        ? nuxtApp.payload.data[key]
        : nuxtApp.static.data[key];
    },
  };

  const asyncData = isKeyProvided
    ? useAsyncData<DataT, ErrorT>(
        key as string | Ref<string> | ComputedRef<string>,
        wrappedHandler,
        finalOptions,
      )
    : useAsyncData<DataT, ErrorT>(wrappedHandler, finalOptions);

  return {
    ...asyncData,
    isLoading: computed(() => asyncData.status.value === "pending"),
    onSuccess: successHook.on,
    onError: errorHook.on,
    onFinally: finallyHook.on,
  } as UseApiReturn<DataT, ErrorT>;
}
