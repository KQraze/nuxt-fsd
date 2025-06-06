export type EventHandler<T = unknown> = (data: T) => void;

export type SubscribeEvent<T> = (handler: EventHandler<T>) => void;

export type EventHook<T = unknown> = {
  on: SubscribeEvent<T>;
  off: SubscribeEvent<T>;
  trigger: EventHandler<T>;
};

export function createEventHook<T = unknown | undefined>(): EventHook<T> {
  const handlers = new Set<EventHandler<T>>();

  const trigger: EventHandler<T> = (data: T) => {
    handlers.forEach((handler) => handler(data));
  };

  const on = (handler: EventHandler<T>) => {
    handlers.add(handler);
  };

  const off = (handler: EventHandler<T>) => {
    handlers.delete(handler);
  };

  return { trigger, on, off };
}
