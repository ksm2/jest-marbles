import { jest } from "@jest/globals";
import { Scheduler } from "../Scheduler.js";

describe("Scheduler", () => {
  let scheduler: Scheduler;

  beforeEach(() => {
    scheduler = new Scheduler();
  });

  it("should increase time", async () => {
    expect(scheduler.time).toBe(-1);
    await scheduler.advance();
    expect(scheduler.time).toBe(0);
    await scheduler.advance();
    expect(scheduler.time).toBe(1);
  });

  it("should call a handler on a specific time", async () => {
    const callback = jest.fn();
    scheduler.on(1, callback);

    expect(callback).not.toHaveBeenCalled();
    await scheduler.advance();
    expect(callback).not.toHaveBeenCalled();
    await scheduler.advance();
    expect(callback).toHaveBeenCalled();
  });
});
