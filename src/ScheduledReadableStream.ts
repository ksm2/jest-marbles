import { Scheduler } from "./Scheduler";
import { ReadableStream, ReadableStreamDefaultReader, ReadableWritablePair } from "isomorphic-streams";

export class ScheduledReadableStream<R> implements AsyncIterable<R> {
  readonly #scheduler: Scheduler;
  readonly #readableStream: ReadableStream<R>;

  constructor(scheduler: Scheduler, readableStream: ReadableStream<R>) {
    this.#scheduler = scheduler;
    this.#readableStream = readableStream;
  }

  get scheduler(): Scheduler {
    return this.#scheduler;
  }

  [Symbol.asyncIterator](): AsyncIterator<R> {
    return this.#readableStream[Symbol.asyncIterator]();
  }

  pipeThrough<T>(transform: ReadableWritablePair<T, R>, options?: StreamPipeOptions): ScheduledReadableStream<T> {
    return new ScheduledReadableStream<T>(this.#scheduler, this.#readableStream.pipeThrough(transform, options));
  }

  getReader(): ReadableStreamDefaultReader<R> {
    return this.#readableStream.getReader();
  }
}
