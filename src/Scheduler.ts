import process from "node:process";

export class Scheduler {
  #time = -1;
  #handlers = new Set<[number, () => void]>();

  get time(): number {
    return this.#time;
  }

  on(time: number, callback: () => void) {
    this.#handlers.add([time, callback]);
  }

  async advance() {
    this.#time += 1;
    for (const [time, handler] of this.#handlers) {
      if (this.#time === time) {
        handler();
      }
    }
    await new Promise((f) => process.nextTick(f));
  }
}
