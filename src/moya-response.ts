import { Equatable } from "./util/equatable";
import { ClosedRange } from "./util/closed-range";
import { MoyaError } from "./moya-error";

/// Represents a response to a `MoyaProvider.request`.
export class MoyaResponse implements Equatable<MoyaResponse> {
  /// The status code of the response.
  statusCode: number;

  /// The response data.
  data: Blob;

  /// The original URLRequest for the response.
  request: Request | null;

  /// The HTTPURLResponse object.
  response: Response | null;

  constructor(statusCode: number, data: Blob, request: Request | null = null, response: Response | null = null) {
    this.statusCode = statusCode;
    this.data = data;
    this.request = request;
    this.response = response;
  }

  /// A text description of the `MoyaResponse`.
  toString(): string {
    return `Status Code: ${this.statusCode}, Data Length: ${this.data.size}`;
  }

  equals(other: MoyaResponse): boolean {
    return this.statusCode == other.statusCode && this.data == other.data && this.response == other.response;
  }

  // MARK: Extensions

  /**
     Returns the `MoyaResponse` if the `statusCode` falls within the specified range.

     - parameters:
        - statusCode: The range of acceptable status codes or value for acceptable status code.
     - throws: `MoyaError.statusCode` when others are encountered.
    */
  filter(statusCode: ClosedRange | number): MoyaResponse {
    if (typeof statusCode === "number") {
      statusCode = new ClosedRange(statusCode, statusCode);
    }

    if (!statusCode.contains(this.statusCode)) {
      throw MoyaError.statusCode(this);
    }

    return this;
  }

  /**
     Returns the `MoyaResponse` if the `statusCode` falls within the range 200 - 299.

     - throws: `MoyaError.statusCode` when others are encountered.
    */
  filterSuccessfulStatusCodes(): MoyaResponse {
    let range = new ClosedRange(200, 299);
    return this.filter(range);
  }

  /**
     Returns the `MoyaResponse` if the `statusCode` falls within the range 200 - 399.

     - throws: `MoyaError.statusCode` when others are encountered.
    */
  filterSuccessfulStatusAndRedirectCodes(): MoyaResponse {
    let range = new ClosedRange(200, 399);
    return this.filter(range);
  }

  // /// Maps data received from the signal into a UIImage.
  // func mapImage() throws -> Image {
  //     guard let image = Image(data: data) else {
  //         throw MoyaError.imageMapping(self)
  //     }
  //     return image
  // }

  //   /// Maps data received from the signal into a JSON object.
  //   ///
  //   /// - parameter failsOnEmptyData: A Boolean value determining
  //   /// whether the mapping should fail if the data is empty.
  //   mapJSON(failsOnEmptyData: boolean = true): any {
  //       do {
  //           return try JSONSerialization.jsonObject(with: data, options: .allowFragments)
  //       } catch {
  //           if data.count < 1 && !failsOnEmptyData {
  //               return NSNull()
  //           }
  //           throw MoyaError.jsonMapping(self)
  //       }
  //   }

  // /// Maps data received from the signal into a String.
  // ///
  // /// - parameter atKeyPath: Optional key path at which to parse string.
  // public func mapString(atKeyPath keyPath: String? = nil) throws -> String {
  //     if let keyPath = keyPath {
  //         // Key path was provided, try to parse string at key path
  //         guard let jsonDictionary = try mapJSON() as? NSDictionary,
  //             let string = jsonDictionary.value(forKeyPath: keyPath) as? String else {
  //                 throw MoyaError.stringMapping(self)
  //         }
  //         return string
  //     } else {
  //         // Key path was not provided, parse entire response as string
  //         guard let string = String(data: data, encoding: .utf8) else {
  //             throw MoyaError.stringMapping(self)
  //         }
  //         return string
  //     }
  // }
}
