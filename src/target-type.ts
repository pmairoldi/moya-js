import { Method } from "./method";

/// The protocol used to define the specifications necessary for a `MoyaProvider`.
export interface TargetType {
  /// The target's base `URL`.
  readonly baseURL: URL;

  /// The path to be appended to `baseURL` to form the full `URL`.
  readonly path: string;

  /// The HTTP method used in the request.
  readonly method: Method;

  /// Provides stub data for use in testing.
  readonly sampleData: any; //FIXME: change to proper datatype

  /// The type of HTTP task to be performed.
  //  readonly task: Task;

  /// The headers to be used in the request.
  readonly headers?: { [index: string]: string };
}
