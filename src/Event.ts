export enum EventType {
  VALUE = "value",
  ERROR = "error",
  CLOSED = "closed",
}

interface BaseEvent {
  type: EventType;
  time: number;
}

export interface ValueEvent<T> extends BaseEvent {
  type: EventType.VALUE;
  value: T;
}

export interface ErrorEvent extends BaseEvent {
  type: EventType.ERROR;
  reason: unknown;
}

export interface ClosedEvent extends BaseEvent {
  type: EventType.CLOSED;
}

export type Event<T> = ValueEvent<T> | ErrorEvent | ClosedEvent;

export function eventsEqual<T>(actualEvents: Set<Event<T>>, expectedEvents: Set<Event<T>>): boolean {
  if (actualEvents === expectedEvents) {
    return true;
  }

  if (actualEvents.size !== expectedEvents.size) {
    return false;
  }

  const copy = [...expectedEvents];
  for (const event of actualEvents) {
    const index = copy.findIndex((other) => eventEquals(other, event));
    if (index < 0) {
      return false;
    }
    copy.splice(index, 1);
  }
  return copy.length === 0;
}

function eventEquals<T>(e1: Event<T>, e2: Event<T>): boolean {
  if (e1.type !== e2.type || e1.time !== e2.time) {
    return false;
  }

  switch (e1.type) {
    case EventType.VALUE: {
      return e1.value === (e2 as ValueEvent<T>).value;
    }
    case EventType.ERROR: {
      const other = e2 as ErrorEvent;
      if (e1.reason === other.reason) {
        return true;
      }

      return Object.getPrototypeOf(e1.reason) === Object.getPrototypeOf(other.reason);
    }
    case EventType.CLOSED: {
      return true;
    }
  }
}
