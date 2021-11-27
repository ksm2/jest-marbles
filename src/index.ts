import { marbles } from "./marbles";
import { streamsEqual } from "./streamsEqual";
import { ScheduledReadableStream } from "./ScheduledReadableStream";

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
