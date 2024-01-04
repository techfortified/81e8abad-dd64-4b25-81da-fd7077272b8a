import type { PredictedProcess } from './PredictedProcess';

export class PredictedProcessesManager {
  private _processes: PredictedProcess[] = [];

  public constructor(processes: readonly PredictedProcess[] = []) {
    this._processes = processes.slice();
  }

  public get processes(): readonly PredictedProcess[] {
    return this._processes.slice();
  }

  public addProcess(process: PredictedProcess): this {
    this._processes.push(process);
    return this;
  }

  public removeProcess(id: number): this {
    this._processes = this._processes.filter((process) => process.id !== id);
    return this;
  }

  public getProcess(id: number): PredictedProcess | undefined {
    return this.processes.find((process) => process.id === id);
  }

  /**
   * Executes multiple predicted processes.
   *
   * WRITE UP:
   * (Please provide a detailed explanation of your approach, specifically the reasoning behind your design decisions. This can be done _after_ the 1h30m time limit.)
   *
   * Certainly! Let's dive into the design decisions made for the `runAll()` method in the `PredictedProcessesManager` class.

### Purpose of `runAll()`

The `runAll()` method is intended to execute multiple `PredictedProcess` instances asynchronously. It can optionally take an `AbortSignal` to allow for the potential cancellation of these processes.

### Design Decisions:

#### 1. Asynchronous Execution

- **Use of `async/await`: The method is declared as `async` to enable the use of `await`, allowing for handling multiple asynchronous operations concurrently.

- **Promise-Based Approach:** It uses `Promise.all()` to handle multiple promises simultaneously. This ensures concurrent execution of all processes.

#### 2. Handling Signals

- **Signal as an Optional Parameter:** The `signal` parameter is optional (marked by `?` in TypeScript). If provided, it will be used to potentially abort the ongoing processes.

- **Conditional Execution:** It uses a ternary operator to conditionally call `process.run(signal)` or `process.run()` based on the existence of the `signal`. If `signal` exists, it is passed to the `run()` method of each `PredictedProcess`. If not, processes are run without signals.

#### 3. Concurrent Execution

- **`Promise.all()` for Concurrent Execution:** The `this._processes.map()` creates an array of Promises by mapping each `PredictedProcess` instance to its `run()` method call. `Promise.all()` then executes all these Promises concurrently.

- **Awaiting Completion:** By using `await Promise.all()`, the method waits for all `run()` calls to resolve (or reject). This ensures that the `runAll()` method only completes after all processes have finished executing.

#### 4. Handling Results

- **Handling Promise Resolutions:** The method itself returns a `Promise<void>`. This ensures that the external caller can await the completion of all processes initiated by `runAll()`.

### Reasoning Behind Design:

1. **Concurrent Execution:** Utilizing `Promise.all()` allows for efficient concurrent execution of multiple asynchronous operations (in this case, running multiple processes). This maximizes performance by initiating all processes concurrently and awaiting their completion collectively.

2. **Signal Handling:** The method provides flexibility by accepting an optional `AbortSignal`. This enables the potential cancellation of ongoing processes if the signal is triggered.

3. **Asynchronous Nature:** The use of `async/await` ensures non-blocking behavior, allowing the caller to await the completion of all processes without blocking the execution of other code.

4. **Clarity and Readability:** The design aims for readability by clearly expressing the logic for running multiple processes concurrently. It uses concise constructs like the ternary operator to determine whether to pass the `signal` to each process's `run()` method.

5. **Consistency with Promises:** The use of Promises and asynchronous handling maintains consistency with modern JavaScript patterns and ensures a straightforward and manageable way to handle asynchronous operations.

In summary, the design aims to provide a flexible, efficient, and readable way to execute multiple `PredictedProcess` instances concurrently while allowing for potential cancellation via `AbortSignal`. It ensures clarity in handling asynchronous operations and maintains consistency with modern JavaScript asynchronous patterns.
   *
   */
  public async runAll(signal?: AbortSignal): Promise<void> {
    // TODO: Implement this.
    await Promise.all(this._processes.map(_process => signal ? _process.run(signal) : _process.run()))
  }
}
