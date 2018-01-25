import { MoyaError } from "./moya-error";
import { TargetType } from "./target-type";
import { Result } from "./util/result";
import { MoyaResponse } from "./moya-response";

/// A Moya Plugin receives callbacks to perform side effects wherever a request is sent or received.
///
/// for example, a plugin may be used to
///     - log network requests
///     - hide and show a network activity indicator
///     - inject additional information into a request
export interface PluginType {
  /// Called to modify a request before sending.
  prepare?(request: Request, target: TargetType): Request;

  /// Called immediately before a request is sent over the network (or stubbed).
  willSend?(request: RequestType, target: TargetType): void;

  /// Called after a response has been received, but before the MoyaProvider has invoked its completion handler.
  didReceive?(result: Result<MoyaResponse, MoyaError>, target: TargetType): void;

  /// Called to modify a result before completion.
  process?(result: Result<MoyaResponse, MoyaError>, target: TargetType): Result<MoyaResponse, MoyaError>;
}

/// Request type used by `willSend` plugin function.
export interface RequestType {
  // Note:
  //
  // We use this protocol instead of the Alamofire request to avoid leaking that abstraction.
  // A plugin should not know about Alamofire at all.

  /// Retrieve an `NSURLRequest` representation.
  readonly request: Request | null;

  /// Authenticates the request with a username and password.
  // authenticate(user: String, password: String, persistence: URLCredential.Persistence): RequestType;

  /// Authenticates the request with an `NSURLCredential` instance.
  // authenticate(usingCredential: URLCredential): RequestType;
}
