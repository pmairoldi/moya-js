import { Cancellable } from "./cancellable";

/// Internal token that can be used to cancel requests
export class CancellableToken implements Cancellable {
  readonly cancelAction: () => void;
  readonly request?: Request;

  private _isCancelled = false;
  set isCancelled(value: boolean) {
    this._isCancelled = value;
  }

  cancel() {
    if (this._isCancelled) {
      return;
    }

    this.isCancelled = true;
    this.cancelAction();
  }

  // constructor(action: () => void) {
  //     this.cancelAction = action
  //     this.request = null
  // }

  // constructor(request: Request) {
  //     this.request = request
  //     this.cancelAction = () => {
  //         request()
  //     }
  // }
}
