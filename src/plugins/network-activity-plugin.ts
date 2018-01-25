import { TargetType } from "../target-type";
import { PluginType, RequestType } from "../plugin";
import { MoyaError } from "../moya-error";
import { Result } from "../util/result";
import { MoyaResponse } from "../moya-response";

/// Network activity change notification type.
export enum NetworkActivityChangeType {
  Began,
  Ended
}

export type NetworkActivityClosure = (change: NetworkActivityChangeType, target: TargetType) => void;

/// Notify a request's network activity changes (request begins or ends).
export class NetworkActivityPlugin implements PluginType {
  networkActivityClosure: NetworkActivityClosure;

  /// Initializes a NetworkActivityPlugin.
  constructor(networkActivityClosure: NetworkActivityClosure) {
    this.networkActivityClosure = networkActivityClosure;
  }

  // MARK: Plugin

  /// Called by the provider as soon as the request is about to start
  willSend(request: RequestType, target: TargetType) {
    this.networkActivityClosure(NetworkActivityChangeType.Began, target);
  }

  /// Called by the provider as soon as a response arrives, even if the request is canceled.
  didReceive(result: Result<MoyaResponse, MoyaError>, target: TargetType) {
    this.networkActivityClosure(NetworkActivityChangeType.Ended, target);
  }
}
