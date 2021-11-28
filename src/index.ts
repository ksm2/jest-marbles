import { marbles } from "./marbles.js";
import { streamsEqual } from "./streamsEqual.js";
import { ScheduledReadableStream } from "./ScheduledReadableStream.js";

declare global {
  namespace jest {
    interface Matchers<R extends ScheduledReadableStream<any>> {
      toStream(other: ScheduledReadableStream<any>): Promise<boolean>;
    }
  }
}

expect.extend({
  async toStream(received: ScheduledReadableStream<any>, expected: ScheduledReadableStream<any>) {
    const pass = await streamsEqual(received, expected);
    if (pass) {
      return {
        message: () => `expected received stream not to match expected stream`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected received stream to match expected stream`,
        pass: false,
      };
    }
  },
});

export { marbles };
