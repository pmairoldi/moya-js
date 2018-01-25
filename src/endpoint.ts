import { Method } from "./method";
import { Task, TaskType } from "./task";
import { RequestMappingError } from "./moya-error";

/// Used for stubbing responses.
export enum EndpointSampleResponseType {
  /// The network returned a response, including status code and data.
  NetworkResponse,

  /// The network returned response which can be fully customized.
  Response,

  /// The network failed to send the request, or failed to retrieve a response (eg a timeout).
  NetworkError
}

export class EndpointSampleNetworkResponse {
  readonly type: EndpointSampleResponseType.NetworkResponse;

  constructor(public statusCode: number, data: Blob) {}
}

export class EndpointSampleHttpResponse {
  readonly type: EndpointSampleResponseType.Response;

  constructor(public response: Response, data: Blob) {}
}

export class EndpointSampleNetworkError {
  readonly type: EndpointSampleResponseType.NetworkError;

  constructor(public error: Error) {}
}

export type EndpointSampleResponse =
  | EndpointSampleNetworkResponse
  | EndpointSampleHttpResponse
  | EndpointSampleNetworkError;
export type SampleResponseClosure = () => SampleResponseClosure;

/// Class for reifying a target of the `Target` enum unto a concrete `Endpoint`.
export class Endpoint<Target> {
  /// A string representation of the URL for the request.
  readonly url: string;

  /// A closure responsible for returning an `EndpointSampleResponse`.
  readonly sampleResponseClosure: SampleResponseClosure;

  /// The HTTP method for the request.
  readonly method: Method;

  /// The `Task` for the request.
  readonly task: Task;

  /// The HTTP header fields for the request.
  readonly httpHeaderFields: Map<string, string> | null;

  constructor(
    url: string,
    sampleResponseClosure: SampleResponseClosure,
    method: Method,
    task: Task,
    httpHeaderFields: Map<string, string> | null
  ) {
    this.url = url;
    this.sampleResponseClosure = sampleResponseClosure;
    this.method = method;
    this.task = task;
    this.httpHeaderFields = httpHeaderFields;
  }

  /// Convenience method for creating a new `Endpoint` with the same properties as the receiver, but with added HTTP header fields.
  adding(newHTTPHeaderFields: Map<string, string>): Endpoint<Target> {
    return new Endpoint(this.url, this.sampleResponseClosure, this.method, this.task, this.add(newHTTPHeaderFields));
  }

  /// Convenience method for creating a new `Endpoint` with the same properties as the receiver, but with replaced `task` parameter.
  replacing(task: Task): Endpoint<Target> {
    return new Endpoint(this.url, this.sampleResponseClosure, this.method, this.task, this.httpHeaderFields);
  }

  private add(headers: Map<string, string> | null): Map<string, string> | null {
    if (headers === null || headers.size === 0) {
      return this.httpHeaderFields;
    }

    let newHTTPHeaderFields = this.httpHeaderFields === null ? new Map<string, string>() : this.httpHeaderFields;

    headers.forEach((value, key) => {
      newHTTPHeaderFields.set(key, value);
    });

    return newHTTPHeaderFields;
  }

  /// Returns the `Endpoint` converted to a `URLRequest` if valid. Throws an error otherwise.
  urlRequest(): Request {
    let requestURL: URL;

    try {
      requestURL = new URL(this.url);
    } catch {
      throw new RequestMappingError(this.url);
    }

    var requestConfig: RequestInit = {
      method: this.method.toString(),
      headers:
        this.httpHeaderFields === null
          ? undefined
          : Array.from<[string, string], string[]>(this.httpHeaderFields.entries())
    };

    switch (this.task.type) {
      case TaskType.RequestPlain:
      case TaskType.UploadFile:
      case TaskType.UploadMultipart:
      case TaskType.DownloadDestination:
        break;
      //   case TaskType.RequestData:
      //     requestConfig.body = this.task.data;
      //     break;
      //   case TaskType.RequestParameters:
      //       return try request.encoded(parameters: parameters, parameterEncoding: parameterEncoding)
      //       break;
      //   case let .uploadCompositeMultipart(_, urlParameters):
      //       let parameterEncoding = URLEncoding(destination: .queryString)
      //       return try request.encoded(parameters: urlParameters, parameterEncoding: parameterEncoding)
      //   case let .downloadParameters(parameters, parameterEncoding, _):
      //       return try request.encoded(parameters: parameters, parameterEncoding: parameterEncoding)
      //   case let .requestCompositeData(bodyData: bodyData, urlParameters: urlParameters):
      //       request.httpBody = bodyData
      //       let parameterEncoding = URLEncoding(destination: .queryString)
      //       return try request.encoded(parameters: urlParameters, parameterEncoding: parameterEncoding)
      //   case let .requestCompositeParameters(bodyParameters: bodyParameters, bodyEncoding: bodyParameterEncoding, urlParameters: urlParameters):
      //       if bodyParameterEncoding is URLEncoding { fatalError("URLEncoding is disallowed as bodyEncoding.") }
      //       let bodyfulRequest = try request.encoded(parameters: bodyParameters, parameterEncoding: bodyParameterEncoding)
      //       let urlEncoding = URLEncoding(destination: .queryString)
      //       return try bodyfulRequest.encoded(parameters: urlParameters, parameterEncoding: urlEncoding)
    }

    return new Request(requestURL.toString(), requestConfig);
  }
}

// /// Required for using `Endpoint` as a key type in a `Dictionary`.
// extension Endpoint: Equatable, Hashable {
//     public var hashValue: Int {
//         let request = try? urlRequest()
//         return request?.hashValue ?? url.hashValue
//     }

//     /// Note: If both Endpoints fail to produce a URLRequest the comparison will
//     /// fall back to comparing each Endpoint's hashValue.
//     public static func == <T>(lhs: Endpoint<T>, rhs: Endpoint<T>) -> Bool {
//         let lhsRequest = try? lhs.urlRequest()
//         let rhsRequest = try? rhs.urlRequest()
//         if lhsRequest != nil, rhsRequest == nil { return false }
//         if lhsRequest == nil, rhsRequest != nil { return false }
//         if lhsRequest == nil, rhsRequest == nil { return lhs.hashValue == rhs.hashValue }
//         return (lhsRequest == rhsRequest)
//     }
// }
