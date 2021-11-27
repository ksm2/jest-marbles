import { ScheduledReadableStream } from "./ScheduledReadableStream";
import { Event, eventsEqual, EventType } from "./Event";

export async function streamsEqual<T>(
  actual: ScheduledReadableStream<T>,
  expected: ScheduledReadableStream<T>,
): Promise<boolean> {
  if (actual === expected) {
    return true;
  }

  const actualEvents = await streamToArray(actual);
  const expectedEvents = await streamToArray(expected);
  return eventsEqual(actualEvents, expectedEvents);
}

async function streamToArray<T>(stream: ScheduledReadableStream<T>): Promise<Set<Event<T>>> {
  const scheduler = stream.scheduler;

  const events = new Set<Event<T>>();
  let done = false;

  async function readStream() {
    const reader = stream.getReader();
    let readingDone = false;
    do {
      try {
        const next = await reader.read();
        readingDone = next.done;
        if (next.done) {
          events.add({ type: EventType.CLOSED, time: scheduler.time });
        } else {
          events.add({ type: EventType.VALUE, time: scheduler.time, value: next.value });
        }
      } catch (reason) {
        events.add({ type: EventType.ERROR, time: scheduler.time, reason });
        readingDone = true;
      }
    } while (!readingDone);
    done = true;
  }

  async function advanceTime() {
    do {
      await scheduler.advance();
    } while (!done);
  }

  await Promise.all([readStream(), advanceTime()]);
  return events;
}
