/// Represents an HTTP task.
export enum TaskType {
  /// A request with no additional data.
  RequestPlain,

  /// A requests body set with data.
  RequestData,

  /// A requests body set with encoded parameters.
  RequestParameters,

  /// A requests body set with data, combined with url parameters.
  RequestCompositeData,

  /// A requests body set with encoded parameters combined with url parameters.
  RequestCompositeParameters,

  /// A file upload task.
  UploadFile,

  /// A "multipart/form-data" upload task.
  UploadMultipart,

  /// A "multipart/form-data" upload task  combined with url parameters.
  UploadCompositeMultipart,

  /// A file download task to a destination.
  DownloadDestination,

  /// A file download task to a destination with extra parameters using the given encoding.
  DownloadParameters
}

export class RequestPlainTask {
  readonly type: TaskType.RequestPlain;
}

export class RequestDataTask {
  readonly type: TaskType.RequestData;

  constructor(public data: Blob) {}
}

export class RequestParameters {
  readonly type: TaskType.RequestParameters;

  constructor(public parameters: Map<string, any>, public encoding: ParameterEncoding) {}
}

export class RequestCompositeDataTask {
  readonly type: TaskType.RequestCompositeData;

  constructor(public bodyData: Blob, public urlParameters: Map<string, any>) {}
}

export class RequestCompositeParametersTask {
  readonly type: TaskType.RequestCompositeParameters;

  constructor(
    public bodyParameters: Map<string, any>,
    public bodyEncoding: ParameterEncoding,
    public urlParameters: Map<string, any>
  ) {}
}

export class UploadFileTask {
  readonly type: TaskType.UploadFile;

  constructor(public url: URL) {}
}

export class UploadMultipartTask {
  readonly type: TaskType.UploadMultipart;

  constructor(public parts: [MultipartFormData]) {}
}

export class UploadCompositeMultipartTask {
  readonly type: TaskType.UploadCompositeMultipart;

  constructor(public parts: [MultipartFormData], public urlParameters: Map<string, any>) {}
}

export class DownloadDestinationTask {
  readonly type: TaskType.DownloadDestination;

  constructor(public destination: DownloadDestination) {}
}

export class DownloadParametersTask {
  readonly type: TaskType.DownloadParameters;

  constructor(
    public parameters: Map<string, any>,
    public encoding: ParameterEncoding,
    public destination: DownloadDestination
  ) {}
}

export type Task =
  | RequestPlainTask
  | RequestDataTask
  | RequestParameters
  | RequestCompositeDataTask
  | RequestCompositeParametersTask
  | UploadFileTask
  | UploadMultipartTask
  | UploadCompositeMultipartTask
  | DownloadDestinationTask
  | DownloadParametersTask;
