/// Method to provide the form data.
export enum FormDataProvider {
  Data, //(Foundation.Data)
  File, //(URL)
  Stream //(InputStream, UInt64)
}

/// Represents "multipart/form-data" for an upload.
export class MultipartFormData {
  /// The method being used for providing form data.
  readonly provider: FormDataProvider;

  /// The name.
  readonly name: string;

  /// The file name.
  readonly fileName: string | null;

  /// The MIME type
  readonly mimeType: string | null;

  constructor(
    provider: FormDataProvider,
    name: string,
    fileName: string | null = null,
    mimeType: string | null = null
  ) {
    this.provider = provider;
    this.name = name;
    this.fileName = fileName;
    this.mimeType = mimeType;
  }
}

// MARK: RequestMultipartFormData appending
// internal extension RequestMultipartFormData {
//     func append(data: Data, bodyPart: MultipartFormData) {
//         if let mimeType = bodyPart.mimeType {
//             if let fileName = bodyPart.fileName {
//                 append(data, withName: bodyPart.name, fileName: fileName, mimeType: mimeType)
//             } else {
//                 append(data, withName: bodyPart.name, mimeType: mimeType)
//             }
//         } else {
//             append(data, withName: bodyPart.name)
//         }
//     }

//     func append(fileURL url: URL, bodyPart: MultipartFormData) {
//         if let fileName = bodyPart.fileName, let mimeType = bodyPart.mimeType {
//             append(url, withName: bodyPart.name, fileName: fileName, mimeType: mimeType)
//         } else {
//             append(url, withName: bodyPart.name)
//         }
//     }

//     func append(stream: InputStream, length: UInt64, bodyPart: MultipartFormData) {
//         append(stream, withLength: length, name: bodyPart.name, fileName: bodyPart.fileName ?? "", mimeType: bodyPart.mimeType ?? "")
//     }
// }
