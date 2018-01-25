/// Protocol to define the opaque type returned from a request.
export interface Cancellable {
  /// A Boolean value stating whether a request is cancelled.
  readonly isCancelled: boolean;

  /// Cancels the represented request.
  cancel(): void;
}

export class CancellableWrapper implements Cancellable {
  private innerCancellable: Cancellable = new SimpleCancellable();

  get isCancelled(): boolean {
    return this.innerCancellable.isCancelled;
  }

  cancel() {
    this.innerCancellable.cancel();
  }
}

class SimpleCancellable implements Cancellable {
  isCancelled = false;

  cancel() {
    this.isCancelled = true;
  }
}
