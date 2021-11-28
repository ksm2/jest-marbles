import { ReadableStream, ReadableStreamDefaultController } from "isomorphic-streams";
import { ScheduledReadableStream } from "./ScheduledReadableStream.js";
import { Scheduler } from "./Scheduler.js";

export const C = Symbol("Close");
export const X = Symbol("Error");

type Value<T> = Terminal<T> | Array<Terminal<T>>;
type Terminal<T> = T | typeof C | typeof X;

export function marbles<T>(template: TemplateStringsArray, ...values: Array<Value<T>>): ScheduledReadableStream<T> {
  const [head, ...tail] = template;
  const scheduler = new Scheduler();
  const readableStream = new ReadableStream<T>({
    async start(controller) {
      let time = head.length;
      for (const [value, suffix] of zip(values, tail)) {
        scheduler.on(time, () => {
          if (Array.isArray(value)) {
            value.forEach(apply(controller));
          } else {
            apply(controller)(value);
          }
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

function apply<T>(controller: ReadableStreamDefaultController<T>) {
  return function (terminal: Terminal<T>) {
    if (terminal === C) {
      controller.close();
    } else if (terminal === X) {
      controller.error();
    } else {
      controller.enqueue(terminal);
    }
  };
}

function buildChain<T>([head, ...tail]: TemplateStringsArray, values: unknown[]): string {
  return [head, ...zip(values, tail).map(([value, suffix]) => "-".repeat(approxValueLength(value)) + suffix)].join("");
}

function approxValueLength(value: Value<any>): number {
  if (Array.isArray(value)) {
    return value.map((it) => approxValueLength(it)).reduce((a, b) => a + b + 2) + 5;
  }

  if (value === C || value === X) {
    return 4;
  }
  return JSON.stringify(value).length + 3;
}

function zip<A, B>(array1: A[], array2: B[]): Array<readonly [A, B]> {
  if (array1.length !== array2.length) throw new TypeError("Arrays have different length");
  return array1.map((v1, index) => [v1, array2[index]]);
}
