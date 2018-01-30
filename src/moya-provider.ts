import { TargetType } from "./target-type";
import { Result, Failure, Success } from "./util/result";
import { MoyaResponse } from "./moya-response";
import { MoyaError, MoyaErrorEnum } from "./moya-error";
import { Cancellable } from "./cancellable";
import { Endpoint, EndpointSampleResponse } from "./endpoint";
import { PluginType } from "./plugin";
import { CancellableToken } from "./cancellable-token";

/// Closure to be executed when a request has completed.
export type Completion = (result: Result<Response, MoyaError>) => void;

/// Closure to be executed when progress changes.
export type ProgressBlock = (progress: ProgressResponse) => void;

/// A type representing the progress of a request.
export class ProgressResponse {
  /// The optional response of the request.
  response?: Response;

  /// An object that conveys ongoing progress for a given request.
  // progressObject?: Progress
  progressObject?: number;

  /// Initializes a `ProgressResponse`.
  constructor(progress?: number, response?: Response) {
    this.progressObject = progress;
    this.response = response;
  }

  /// The fraction of the overall work completed by the progress object.
  get progress(): number {
    return this.progressObject === undefined ? 1.0 : this.progressObject;
  }

  /// A Boolean value stating whether the request is completed.
  get completed(): boolean {
    return this.progress == 1.0 && this.response !== undefined;
  }
}

/// A protocol representing a minimal interface for a MoyaProvider.
/// Used by the reactive provider extensions.
export interface MoyaProviderType<Target extends TargetType> {
  /// Designated request-making method. Returns a `Cancellable` token to cancel the request later.
  request(target: Target, completion: Completion, progress?: ProgressBlock): Cancellable;
}

/// Closure that defines the endpoints for the provider.
export type EndpointClosure<Target extends TargetType> = (target: Target) => Endpoint<Target>;

/// Closure that decides if and what request should be performed.
export type RequestResultClosure<Target extends TargetType> = (reault: Result<Request, MoyaError>) => void;

/// Closure that resolves an `Endpoint` into a `RequestResult`.
export type RequestClosure<Target extends TargetType> = (
  endpoint: Endpoint<Target>,
  closure: RequestResultClosure<Target>
) => void;

/// Closure that decides if/how a request should be stubbed.
export type StubClosure<Target extends TargetType> = (target: Target) => StubBehavior;

/// Request provider class. Requests should be made through this class only.
export class MoyaProvider<Target extends TargetType> implements MoyaProviderType<Target> {
  /// A closure responsible for mapping a `TargetType` to an `EndPoint`.
  readonly endpointClosure: EndpointClosure<Target>;

  /// A closure deciding if and what request should be performed.
  readonly requestClosure: RequestClosure<Target>;

  /// A closure responsible for determining the stubbing behavior
  /// of a request for a given `TargetType`.
  readonly stubClosure: StubClosure<Target>;

  /// The manager for the session.
  // readonly manager: Manager

  /// A list of plugins.
  /// e.g. for logging, network activity indicator or credentials.
  readonly plugins: PluginType[];

  readonly trackInflights: boolean;

  private _inflightRequests: Map<Endpoint<Target>, [Completion]> = new Map();
  set inflightRequests(value: Map<Endpoint<Target>, [Completion]>) {
    this._inflightRequests = value;
  }

  /// Initializes a provider.
  constructor(
    endpointClosure: EndpointClosure<Target> = MoyaProvider.defaultEndpointMapping,
    requestClosure: RequestClosure<Target> = MoyaProvider.defaultRequestMapping,
    stubClosure: StubClosure<Target> = MoyaProvider.neverStub,
    // manager: Manager = MoyaProvider<Target>.defaultAlamofireManager(),
    plugins: PluginType[] = [],
    trackInflights: boolean = false
  ) {
    this.endpointClosure = endpointClosure;
    this.requestClosure = requestClosure;
    this.stubClosure = stubClosure;
    // this.manager = manager
    this.plugins = plugins;
    this.trackInflights = trackInflights;
  }

  /// Returns an `Endpoint` based on the token, method, and parameters by invoking the `endpointClosure`.
  endpoint(token: Target): Endpoint<Target> {
    return this.endpointClosure(token);
  }

  /// Designated request-making method. Returns a `Cancellable` token to cancel the request later.
  request(target: Target, completion: Completion, progress?: ProgressBlock): Cancellable {
    return this.requestNormal(target, progress, completion);
  }

  /// When overriding this method, take care to `notifyPluginsOfImpendingStub` and to perform the stub using the `createStubFunction` method.
  /// Note: this was previously in an extension, however it must be in the original class declaration to allow subclasses to override.
  stubRequest(
    target: Target,
    request: Request,
    completion: Completion,
    endpoint: Endpoint<Target>,
    stubBehavior: StubBehavior
  ): CancellableToken {
    let cancellableToken = new CancellableToken();
    // notifyPluginsOfImpendingStub(for: request, target: target)
    // let plugins = self.plugins
    // let stub: () -> Void = createStubFunction(cancellableToken, forTarget: target, withCompletion: completion, endpoint: endpoint, plugins: plugins, request: request)
    // switch stubBehavior {
    // case .immediate:
    //     switch callbackQueue {
    //     case .none:
    //         stub()
    //     case .some(let callbackQueue):
    //         callbackQueue.async(execute: stub)
    //     }
    // case .delayed(let delay):
    //     let killTimeOffset = Int64(CDouble(delay) * CDouble(NSEC_PER_SEC))
    //     let killTime = DispatchTime.now() + Double(killTimeOffset) / Double(NSEC_PER_SEC)
    //     (callbackQueue ?? DispatchQueue.main).asyncAfter(deadline: killTime) {
    //         stub()
    //     }
    // case .never:
    //     fatalError("Method called to stub request when stubbing is disabled.")
    // }
    return cancellableToken;
  }

  static defaultEndpointMapping<Target extends TargetType>(target: Target): Endpoint<Target> {
    return new Endpoint(
      new URL(target.path, target.baseURL.toString()).toString(),
      () => EndpointSampleResponse.networkResponse(200, target.sampleData),
      target.method,
      target.task,
      target.headers
    );
  }

  static defaultRequestMapping<Target extends TargetType>(
    endpoint: Endpoint<Target>,
    closure: RequestResultClosure<Target>
  ) {
    try {
      let urlRequest = endpoint.urlRequest();
      closure(Result.success(urlRequest));
    } catch (error) {
      let moyaError = error as MoyaError;

      switch (moyaError.type.type) {
        case MoyaErrorEnum.RequestMapping:
          closure(Result.failure(MoyaError.requestMapping(moyaError.type.url)));
          break;

        case MoyaErrorEnum.ParameterEncoding:
          closure(Result.failure(MoyaError.parameterEncoding(moyaError)));
          break;

        default:
          closure(Result.failure(MoyaError.underlying(moyaError, null)));
          break;
      }
    }
  }

  /// Do not stub.
  static neverStub<Target extends TargetType>(_: Target): StubBehavior {
    return StubBehavior.never;
  }

  /// Return a response immediately.
  static immediatelyStub<Target extends TargetType>(_: Target): StubBehavior {
    return StubBehavior.immediate;
  }

  /// Return a response after a delay.
  static delayedStub<Target extends TargetType>(seconds: number): (_: Target) => StubBehavior {
    return () => StubBehavior.delayed(seconds);
  }
}

/// Mark: Stubbing

/// Controls how stub responses are returned.
enum StubBehaviorEnum {
  /// Do not stub.
  never,

  /// Return a response immediately.
  immediate,

  /// Return a response after a delay.
  delayed //(seconds: TimeInterval)
}

interface NeverStubBehavior {
  readonly type: StubBehaviorEnum.never;
}

interface ImmediateStubBehavior {
  readonly type: StubBehaviorEnum.immediate;
}

interface DelayedStubBehavior {
  readonly type: StubBehaviorEnum.delayed;
  readonly seconds: number;
}

type StubBehaviorType = NeverStubBehavior | ImmediateStubBehavior | DelayedStubBehavior;

export class StubBehavior {
  static get never(): StubBehavior {
    return new StubBehavior({ type: StubBehaviorEnum.never });
  }

  static get immediate(): StubBehavior {
    return new StubBehavior({ type: StubBehaviorEnum.immediate });
  }

  static delayed(seconds: number): StubBehavior {
    return new StubBehavior({ type: StubBehaviorEnum.delayed, seconds: seconds });
  }

  private constructor(private type: StubBehaviorType) {}
}

// /// A public function responsible for converting the result of a `URLRequest` to a Result<Moya.Response, MoyaError>.
// public func convertResponseToResult(_ response: HTTPURLResponse?, request: URLRequest?, data: Data?, error: Swift.Error?) ->
//     Result<Moya.Response, MoyaError> {
//         switch (response, data, error) {
//         case let (.some(response), data, .none):
//             let response = Moya.Response(statusCode: response.statusCode, data: data ?? Data(), request: request, response: response)
//             return .success(response)
//         case let (.some(response), _, .some(error)):
//             let response = Moya.Response(statusCode: response.statusCode, data: data ?? Data(), request: request, response: response)
//             let error = MoyaError.underlying(error, response)
//             return .failure(error)
//         case let (_, _, .some(error)):
//             let error = MoyaError.underlying(error, nil)
//             return .failure(error)
//         default:
//             let error = MoyaError.underlying(NSError(domain: NSURLErrorDomain, code: NSURLErrorUnknown, userInfo: nil), nil)
//             return .failure(error)
//         }
// }
