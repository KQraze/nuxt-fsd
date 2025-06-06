/**
 * Options for the useApi composable.
 * @template Result - The original type of the API response.
 * @template AdaptedResult - The type of the response after adaptation.
 * @template AdaptedError - The type of the error after adaptation.
 */
type UseApiOptions<Result, AdaptedResult, AdaptedError> = {
  /**
   * Function to adapt the API response.
   * @param response - The original API response.
   * @returns The adapted response.
   */
  adapter?: (response: Result) => AdaptedResult;

  /**
   * Function to adapt the error.
   * @param error - The original error.
   * @returns The adapted error.
   */
  errorAdapter?: (error: unknown) => AdaptedError;

  /**
   * Cache duration in seconds.
   * If provided, the cached data will be considered valid for this duration.
   */
  cacheTime?: number;
};

/**
 * Return type of the useApi composable.
 * @template Data - The type of the data returned from the API (adapted or raw).
 * @template ErrorT - The type of the error (adapted or raw).
 * @template Args - The type of the arguments passed to the API request.
 */
type UseApiReturn<Data, ErrorT = unknown, Args extends any[] = any[]> = {
  /**
   * Indicates if the API request is in progress.
   */
  isLoading: Ref<boolean>;

  /**
   * Stores the error if the API request fails.
   */
  error: Ref<ErrorT>;

  /**
   * Clears the entire cache.
   */
  clear: () => void;

  /**
   * Clears a specific cached response based on the provided arguments.
   * @param args - The arguments used to identify the cached response.
   */
  clearOne: (...args: Args) => void;

  /**
   * Executes the API request and returns the data. Uses caching unless explicitly bypassed.
   * @param args - The arguments passed to the API request.
   * @returns A Promise resolving to the API data.
   */
  execute: (...args: Args) => Promise<Data>;

  /**
   * Forces a reload of data without using the cache.
   * @param args - The arguments passed to the API request.
   * @returns A Promise resolving to the API data.
   */
  load: (...args: Args) => Promise<Data>;

  /**
   * Returns a reactive reference to the API response data.
   * @param defaultValue - The initial value before the request completes.
   * @param args - The arguments passed to the API request.
   * @returns A reactive reference to the API data.
   */
  getRef: (defaultValue?: Data, ...args: Args) => Ref<Data>;

  /**
   * Retrieves a reactive array of results grouped by a specific argument.
   * @param index - The position of the argument to filter by.
   * @param arg - The value to match against in the argument list.
   * @returns A reactive reference to the grouped results.
   */
  getGroupByArg: <I extends keyof Args>(
      index?: I,
      arg?: Args[I],
  ) => ComputedRef<Data[]>;

  /**
   * Event triggered when a request succeeds.
   */
  onSuccess: SubscribeEvent<Data>;

  /**
   * Event triggered when a request fails.
   */
  onError: SubscribeEvent<ErrorT>;

  /**
   * Event triggered when a request completes, regardless of success or failure.
   */
  onFinally: SubscribeEvent<void>;
};

/**
 * Composable for handling API requests with caching, state management, and optional data adaptation.
 * @template Result - The original API response type.
 * @template AdaptedResult - The transformed type after applying the adapter function.
 * @template AdaptedError - The transformed type after applying the error adapter function.
 * @template Args - The type of the arguments passed to the API request.
 * @param {(...args: Args) => Promise<Result>} request
 * @param {UseApiOptions<Result, AdaptedResult, AdaptedError>} [options] - Опции
 * @returns {UseApiReturn<Result, AdaptedError, Args>}
 */
export function useAPI<
    Result,
    AdaptedResult = Result,
    AdaptedError = unknown,
    Args extends any[] = any[],
>(
    request: (...args: Args) => Promise<Result>,
    options?: UseApiOptions<Result, AdaptedResult, AdaptedError>,
): UseApiReturn<
    AdaptedResult extends Result ? Result : AdaptedResult,
    AdaptedError,
    Args
> {
  type Data = AdaptedResult extends Result ? Result : AdaptedResult;
  type CachedData = Data & { fetchedAt?: Date };

  const successHook = createEventHook<Data>();
  const errorHook = createEventHook<AdaptedError>();
  const finallyHook = createEventHook<void>();

  const isLoading = ref(false);
  const error = ref<AdaptedError | null>(null);
  const triggerRef = ref(0);
  const cache: Ref<Map<string, CachedData>> = ref(new Map());

  const getCacheKey = (args: Args) => JSON.stringify(args);

  const isCacheValid = (data: CachedData): boolean => {
    if (!data.fetchedAt || !options?.cacheTime) return true;
    const expiration =
        new Date(data.fetchedAt).getTime() + options.cacheTime * 1000;
    return Date.now() < expiration;
  };

  const getCachedData = (key: string): Data | null => {
    const data = cache.value.get(key);
    return data && isCacheValid(data) ? data : null;
  };

  const saveToCache = (key: string, data: Data) => {
    const cached: CachedData = options?.cacheTime
        ? { ...data, fetchedAt: new Date() }
        : (data as CachedData);
    cache.value.set(key, cached);
  };

  const adaptResponse = (response: Result): Data =>
      options?.adapter ? (options.adapter(response) as Data) : (response as Data);

  const adaptError = (err: unknown): AdaptedError =>
      options?.errorAdapter ? options.errorAdapter(err) : (err as AdaptedError);

  const execute = async (ignoreCache = false, ...args: Args): Promise<Data> => {
    const cacheKey = getCacheKey(args);

    if (!ignoreCache) {
      const cached = getCachedData(cacheKey);
      if (cached) return cached;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const response = await request(...args);
      const adaptedData = adaptResponse(response);

      saveToCache(cacheKey, adaptedData);
      successHook.trigger(adaptedData);

      triggerRef.value++;
      return adaptedData;
    } catch (err) {
      const adapted = adaptError(err);
      error.value = adapted;
      errorHook.trigger(adapted);
      throw adapted;
    } finally {
      isLoading.value = false;
      finallyHook.trigger();
    }
  };

  const getRef = (defaultValue?: Data, ...args: Args): Ref<Data> => {
    const id = useId();
    const key = `${id}-${getCacheKey(args)}`;

    const { data } = useAsyncData<Data>(key, () => execute(false, ...args), {
      default: () => defaultValue as Data,
      watch: [() => triggerRef.value],
    });

    return data as Ref<Data>;
  };

  const getGroupByArg = <I extends keyof Args>(
      index?: I,
      arg?: Args[I],
  ): ComputedRef<Data[]> => {
    return computed(() =>
        [...cache.value.entries()]
            .filter(([key]) => {
              if (index === undefined) return true;
              const parsedArgs = JSON.parse(key);
              return JSON.stringify(parsedArgs[index]) === JSON.stringify(arg);
            })
            .map(([, value]) => value),
    );
  };

  return {
    isLoading,
    error: error as Ref<AdaptedError>,
    clear: () => cache.value.clear(),
    clearOne: (...args: Args) => cache.value.delete(getCacheKey(args)),
    execute: (...args: Args) => execute(false, ...args),
    load: (...args: Args) => execute(true, ...args),
    getRef,
    getGroupByArg,
    onSuccess: successHook.on,
    onError: errorHook.on,
    onFinally: finallyHook.on,
  };
}
