import { ReadableStream } from "isomorphic-streams";
import { ScheduledReadableStream } from "./ScheduledReadableStream.js";
import { Scheduler } from "./Scheduler.js";

export function marbles<T>(template: TemplateStringsArray, ...values: T[]): ScheduledReadableStream<T> {
  const [head, ...tail] = template;
  const scheduler = new Scheduler();
  const readableStream = new ReadableStream<T>({
    async start(controller) {
      let time = head.length;
      for (const [value, suffix] of zip(values, tail)) {
        scheduler.on(time, () => {
          controller.enqueue(value);
        });
        time += approxValueLength(value);
        time += suffix.length;
      }

      const wholeChain = buildChain(template, values);
      const completion = wholeChain.indexOf("|");
      if (completion >= 0) {
        scheduler.on(completion, () => {
          controller.close();
        });
      }

      const error = wholeChain.indexOf("x");
      if (error >= 0) {
        scheduler.on(error, () => {
          controller.error();
        });
      }
    },
  });

  return new ScheduledReadableStream<T>(scheduler, readableStream);
}

function buildChain<T>([head, ...tail]: TemplateStringsArray, values: unknown[]): string {
  return [head, ...zip(values, tail).map(([value, suffix]) => "-".repeat(approxValueLength(value)) + suffix)].join("");
}

function approxValueLength(value: unknown): number {
  return JSON.stringify(value).length + 3;
}

function zip<A, B>(array1: A[], array2: B[]): Array<readonly [A, B]> {
  if (array1.length !== array2.length) throw new TypeError("Arrays have different length");
  return array1.map((v1, index) => [v1, array2[index]]);
}
