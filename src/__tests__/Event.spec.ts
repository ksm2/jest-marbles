import { Event, eventsEqual, EventType } from "../Event.js";

describe("Event", () => {
  test("eventsEqual", () => {
    const s0 = new Set<Event<any>>();
    const s1 = new Set<Event<number>>([
      { type: EventType.VALUE, time: 0, value: 1 },
      { type: EventType.CLOSED, time: 1 },
    ]);
    const s2 = new Set<Event<number>>([
      { type: EventType.CLOSED, time: 1 },
      { type: EventType.VALUE, time: 0, value: 1 },
    ]);
    const s3 = new Set<Event<number>>([
      { type: EventType.VALUE, time: 0, value: 1 },
      { type: EventType.ERROR, time: 1, reason: new Error() },
    ]);
    const s4 = new Set<Event<number>>([
      { type: EventType.ERROR, time: 1, reason: new Error() },
      { type: EventType.VALUE, time: 0, value: 1 },
    ]);
    const s5 = new Set<Event<number>>([
      { type: EventType.VALUE, time: 0, value: 1 },
      { type: EventType.ERROR, time: 1, reason: new SyntaxError() },
    ]);

    expect(eventsEqual(s0, new Set())).toBe(true);
    expect(eventsEqual(s1, s1)).toBe(true);
    expect(eventsEqual(s2, s2)).toBe(true);
    expect(eventsEqual(s3, s3)).toBe(true);
    expect(eventsEqual(s4, s4)).toBe(true);
    expect(eventsEqual(s1, s2)).toBe(true);
    expect(eventsEqual(s2, s1)).toBe(true);
    expect(eventsEqual(s3, s4)).toBe(true);
    expect(eventsEqual(s4, s3)).toBe(true);

    expect(eventsEqual(s0, s1)).toBe(false);
    expect(eventsEqual(s0, s2)).toBe(false);
    expect(eventsEqual(s0, s3)).toBe(false);
    expect(eventsEqual(s0, s4)).toBe(false);
    expect(eventsEqual(s1, s3)).toBe(false);
    expect(eventsEqual(s2, s3)).toBe(false);
    expect(eventsEqual(s1, s4)).toBe(false);
    expect(eventsEqual(s2, s4)).toBe(false);
    expect(eventsEqual(s1, s5)).toBe(false);
    expect(eventsEqual(s2, s5)).toBe(false);
    expect(eventsEqual(s3, s5)).toBe(false);
  });
});
