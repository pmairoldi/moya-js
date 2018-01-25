import { MoyaResponse } from "./moya-response";

/// A type representing possible errors Moya can throw.
export enum MoyaErrorType {
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
  readonly type: MoyaErrorType.ImageMapping;

  constructor(public response: MoyaResponse) {
    super("Failed to map data to an Image.");
  }
}

export class JsonMappingError extends Error {
  readonly type: MoyaErrorType.JsonMapping;

  constructor(public response: MoyaResponse) {
    super("Failed to map data to JSON.");
  }
}

export class StringMappingError extends Error {
  readonly type: MoyaErrorType.StringMapping;

  constructor(public response: MoyaResponse) {
    super("Failed to map data to a String.");
  }
}

export class StatusCodeError extends Error {
  readonly type: MoyaErrorType.StatusCode;

  constructor(public response: MoyaResponse) {
    super("Status code didn't fall within the given range.");
  }
}

export class UnderlyingError extends Error {
  readonly type: MoyaErrorType.Underlying;

  constructor(public error: Error, public response: MoyaResponse | null) {
    super(error.message);
  }
}

export class RequestMappingError extends Error {
  readonly type: MoyaErrorType.RequestMapping;

  constructor(public url: string) {
    super("Failed to map Endpoint to a Request.");
  }
}

export class ParameterEncodingError extends Error {
  readonly type: MoyaErrorType.ParameterEncoding;

  constructor(public error: Error) {
    super(`Failed to encode parameters for Request. ${error.message}`);
  }
}

export type MoyaError =
  | ImageMappingError
  | JsonMappingError
  | StringMappingError
  | StatusCodeError
  | UnderlyingError
  | RequestMappingError
  | ParameterEncodingError;

export namespace MoyaError {
  /// Depending on error type, returns a `Response` object.
  function response(error: MoyaError): MoyaResponse | null {
    switch (error.type) {
      case MoyaErrorType.ImageMapping:
        return error.response;
      case MoyaErrorType.JsonMapping:
        return error.response;
      case MoyaErrorType.StringMapping:
        return error.response;
      case MoyaErrorType.StatusCode:
        return error.response;
      case MoyaErrorType.Underlying:
        return error.response;
      case MoyaErrorType.RequestMapping:
        return null;
      case MoyaErrorType.ParameterEncoding:
        return null;
      default:
        return null;
    }
  }
}
