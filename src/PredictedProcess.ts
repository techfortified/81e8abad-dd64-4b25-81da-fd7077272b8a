import type { ChildProcess } from 'child_process';
import { spawn } from 'child_process';

export class PredictedProcess {
  private _childProcess: ChildProcess | null = null;
  private _memoizedResults: Map<AbortSignal, Promise<void>> = new Map();
  private _errorTracker: Set<string> = new Set();
  private _isTerminated: boolean = false;

  public constructor(
    public readonly id: number,
    public readonly command: string,
  ) {}

  /**
   * Spawns and manages a child process to execute a given command, with handling for an optional AbortSignal.
   *
   * WRITE UP:
   * (Please provide a detailed explanation of your approach, specifically the reasoning behind your design decisions. This can be done _after_ the 1h30m time limit.)
   *
   * ...
   *
   */
  public async run(signal?: AbortSignal): Promise<void> {
    // TODO: Implement this.
    if (signal && signal.aborted) {
      return Promise.reject(new Error('Signal already aborted'));
    }

    const existingMemoized = signal ? this._memoizedResults.get(signal) : undefined

    if(existingMemoized) return existingMemoized

    const promise = new Promise<void>((resolve, reject) =>{
      const child = spawn(this.command, {shell: true, stdio: 'inherit'});
      this._childProcess = child;

      // listen error events
      child.on('error', (err) =>{
        // track the command with error
        this._errorTracker.add(this.command)
        // set terminated to signal error and avoid caching results with error
        this._isTerminated = true;
        this.cleanup();
        reject(err);
      });

      // listen to close events
      child.on('close', (code, signal) => {
        if (code === 0 && !this._errorTracker.has(this.command)) {
          resolve()
        }
        else{
          this._isTerminated = true;
          reject(new Error(`Process exited with code ${code}  and signal ${signal}`))
        }
        this.cleanup();
      })
      // listen to abort event
      if(signal){
        signal.addEventListener("abort", () =>{
          this._isTerminated = true;
          reject(new Error("Signal aborted during execution"));
          this.cleanup();
        }, {once: true})
      }
    })

    // check if _isTerminated is false and memoize
    if(signal && !this._isTerminated){
      this._memoizedResults.set(signal, promise);
    }
    return promise;
  }

  /**
   * Returns a memoized version of `PredictedProcess`.
   *
   * WRITE UP:
   * (Please provide a detailed explanation of your approach, specifically the reasoning behind your design decisions. This can be done _after_ the 1h30m time limit.)
   *
   * ...
   *
   */
  public memoize(): PredictedProcess {
    // TODO: Implement this.
   const memoizedProcess = new PredictedProcess(this.id, this.command)
   memoizedProcess._memoizedResults = this._memoizedResults
   return memoizedProcess

  }

  private cleanup() {
    if (this._childProcess) {
      this._childProcess.removeAllListeners();
      this._childProcess.kill('SIGTERM');
      this._childProcess = null;
      this._errorTracker.clear();
    }
  }
}
