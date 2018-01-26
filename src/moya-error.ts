import { MoyaResponse } from "./moya-response";

/// A type representing possible errors Moya can throw.
export enum MoyaErrorEnum {
  /// Indicates a response failed to map to an image.
  ImageMapping,

  /// Indicates a response failed to map to a JSON structure.
  JsonMapping,

  /// Indicates a response failed to map to a String.
  StringMapping,

  /// Indicates a response failed with an invalid HTTP status code.
  StatusCode,

  /// Indicates a response failed due to an underlying `Error`.
  Underlying,

  /// Indicates that an `Endpoint` failed to map to a `Request`.
  RequestMapping,

  /// Indicates that an `Endpoint` failed to encode the parameters for the `Request`.
  ParameterEncoding
}

export class ImageMappingError extends Error {
  readonly type = MoyaErrorEnum.ImageMapping;

  constructor(public readonly response: MoyaResponse) {
    super("Failed to map data to an Image.");
  }
}

export class JsonMappingError extends Error {
  readonly type = MoyaErrorEnum.JsonMapping;

  constructor(public readonly response: MoyaResponse) {
    super("Failed to map data to JSON.");
  }
}

export class StringMappingError extends Error {
  readonly type = MoyaErrorEnum.StringMapping;

  constructor(public readonly response: MoyaResponse) {
    super("Failed to map data to a String.");
  }
}

export class StatusCodeError extends Error {
  readonly type = MoyaErrorEnum.StatusCode;

  constructor(public readonly response: MoyaResponse) {
    super("Status code didn't fall within the given range.");
  }
}

export class UnderlyingError extends Error {
  readonly type = MoyaErrorEnum.Underlying;

  constructor(public readonly error: Error, public readonly response: MoyaResponse | null) {
    super(error.message);
  }
}

export class RequestMappingError extends Error {
  readonly type = MoyaErrorEnum.RequestMapping;

  constructor(public readonly url: string) {
    super("Failed to map Endpoint to a Request.");
  }
}

export class ParameterEncodingError extends Error {
  readonly type = MoyaErrorEnum.ParameterEncoding;

  constructor(public readonly error: Error) {
    super(`Failed to encode parameters for Request. ${error.message}`);
  }
}

export type MoyaErrorType =
  | ImageMappingError
  | JsonMappingError
  | StringMappingError
  | StatusCodeError
  | UnderlyingError
  | RequestMappingError
  | ParameterEncodingError;

export class MoyaError implements Error {
  static imageMapping(response: MoyaResponse): MoyaError {
    return new MoyaError(new ImageMappingError(response));
  }

  static jsonMapping(response: MoyaResponse): MoyaError {
    return new MoyaError(new JsonMappingError(response));
  }

  static stringMapping(response: MoyaResponse): MoyaError {
    return new MoyaError(new StringMappingError(response));
  }

  static statusCode(response: MoyaResponse): MoyaError {
    return new MoyaError(new StatusCodeError(response));
  }

  static underlying(error: Error, response: MoyaResponse | null): MoyaError {
    return new MoyaError(new UnderlyingError(error, response));
  }

  static requestMapping(url: string): MoyaError {
    return new MoyaError(new RequestMappingError(url));
  }

  static parameterEncoding(error: Error): MoyaError {
    return new MoyaError(new ParameterEncodingError(error));
  }

  private constructor(private error: MoyaErrorType) {}

  get type(): MoyaErrorType {
    return this.error;
  }

  get name(): string {
    return this.error.name;
  }

  get message(): string {
    return this.error.message;
  }

  get stack(): string | undefined {
    return this.error.stack;
  }

  /// Depending on error type, returns a `Response` object.
  get response(): MoyaResponse | null {
    switch (this.error.type) {
      case MoyaErrorEnum.ImageMapping:
        return this.error.response;
      case MoyaErrorEnum.JsonMapping:
        return this.error.response;
      case MoyaErrorEnum.StringMapping:
        return this.error.response;
      case MoyaErrorEnum.StatusCode:
        return this.error.response;
      case MoyaErrorEnum.Underlying:
        return this.error.response;
      case MoyaErrorEnum.RequestMapping:
        return null;
      case MoyaErrorEnum.ParameterEncoding:
        return null;
      default:
        return null;
    }
  }
}
