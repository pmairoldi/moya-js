import { MoyaResponse } from "../moya-response";
import { ImageMappingError } from "../moya-error";

describe("ErrorSpect", () => {
  //   let response: MoyaResponse;
  //   beforeEach(() => {
  //     response = new MoyaResponse(200, new Blob(), null, null);
  //   });
  //   describe("response computed variable", () => {
  //     it("should handle ImageMapping error", () => {
  //       let error = MoyaError.imageMapping(response);
  //       expect(error.response).toEqual(response);
  //     });
  //     it("should handle JSONMapping error", () => {
  //       let error = MoyaError.jsonMapping(response);
  //       expect(error.response).toEqual(response);
  //     });
  //     it("should handle StringMapping error", () => {
  //       let error = MoyaError.stringMapping(response);
  //       expect(error.response).toEqual(response);
  //     });
  //     it("should handle StatusCode error", () => {
  //       let error = MoyaError.statusCode(response);
  //       expect(error.response).toEqual(response);
  //     });
  //     it("should not handle Underlying error ", () => {
  //       let systemError = new Error("something has gone wrong");
  //       let error = MoyaError.underlying(systemError, undefined);
  //       expect(error.response).toBeUndefined();
  //     });
  //   });
  // describe("mapping a result with empty data", () =>  {
  //     let response = new MoyaResponse(200, new Blob())
  //     it("fails on mapJSON with default parameter", () => {
  //         var mapJSONFailed = false
  //         do {
  //             _ = try response.mapJSON()
  //         } catch {
  //             mapJSONFailed = true
  //         }
  //         expect(mapJSONFailed).toBeTruthy()
  //     })
  //     it("returns default non-nil value on mapJSON with overridden parameter", () => {
  //         var succeeded = true
  //         do {
  //             _ = try response.mapJSON(failsOnEmptyData: false)
  //         } catch {
  //             succeeded = false
  //         }
  //         expect(succeeded).toBeTruthy()
  //     })
  // })
  // describe("Alamofire responses should return the errors where appropriate", () =>  {
  //     it("should return the underlying error in spite of having a response and data", () => {
  //         let underlyingError = NSError(domain: "", code: 0, userInfo: nil)
  //         let request = NSURLRequest() as URLRequest
  //         let response = HTTPURLResponse()
  //         let data = Data()
  //         let result = convertResponseToResult(response, request: request, data: data, error: underlyingError)
  //         switch result {
  //         case let .failure(error):
  //             switch error {
  //             case let .underlying(e, _):
  //                 expect(e as NSError) == underlyingError
  //             default:
  //                 XCTFail("expected to get underlying error")
  //             }
  //         case .success:
  //             XCTFail("expected to be failing result")
  //         }
  //     })
  // })
});
