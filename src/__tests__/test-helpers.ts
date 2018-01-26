import { TargetType } from "../target-type";
import { Method } from "../method";
import { Task, RequestPlainTask } from "../task";
import { Equatable } from "../util/equatable";
import { Endpoint, EndpointSampleResponse } from "../endpoint";

// MARK: - Mock Services
enum GitHubEnum {
  Zen,
  UserProfile
}

interface Zen {
  readonly type: GitHubEnum.Zen;
}

interface UserProfile {
  readonly type: GitHubEnum.UserProfile;
  readonly userId: string;
}

type GitHubType = Zen | UserProfile;

export class GitHub implements TargetType, Equatable<GitHub> {
  static get zen(): GitHub {
    return new GitHub({ type: GitHubEnum.Zen });
  }

  static userProfile(userId: string): GitHub {
    return new GitHub({ type: GitHubEnum.UserProfile, userId: userId });
  }

  private constructor(private endpoint: GitHubType) {}

  get baseURL(): URL {
    return new URL("https://api.github.com");
  }

  get path(): string {
    switch (this.endpoint.type) {
      case GitHubEnum.Zen:
        return "/zen";
      case GitHubEnum.UserProfile:
        return `/users/${encodeURIComponent(this.endpoint.userId)}`;
    }
  }

  get method(): Method {
    return Method.Get;
  }

  get sampleData(): Blob {
    switch (this.endpoint.type) {
      case GitHubEnum.Zen:
        return new Blob(["Half measures are as bad as nothing at all."], { type: "text/plain;charset=utf-8" });
      case GitHubEnum.UserProfile:
        return new Blob(['{"login": "(name)", "id": 100}'], { type: "text/plain;charset=utf-8" });
    }
  }

  get task(): Task {
    return new RequestPlainTask();
  }

  get headers(): Map<string, string> | undefined {
    return undefined;
  }

  equals(other: GitHub): boolean {
    switch ((this.endpoint.type, other.endpoint.type)) {
      case (GitHubEnum.Zen, GitHubEnum.Zen):
        return true;
      case (GitHubEnum.UserProfile, GitHubEnum.UserProfile):
        return (this.endpoint as UserProfile).userId === (other.endpoint as UserProfile).userId;
      default:
        return false;
    }
  }
}

export function url(route: TargetType): string {
  return new URL(route.path, route.baseURL.toString()).toString();
}

export function failureEndpointClosure(target: GitHub): Endpoint<GitHub> {
  let error = new Error("Houston, we have a problem");
  return new Endpoint<GitHub>(
    url(target),
    () => EndpointSampleResponse.networkError(error),
    target.method,
    target.task,
    target.headers
  );
}

// enum HTTPBin: TargetType {
//     case basicAuth
//     case post
//     case upload(file: URL)
//     case uploadMultipart([MultipartFormData], [String: Any]?)

//     var baseURL: URL { return URL(string: "http://httpbin.org")! }
//     var path: String {
//         switch self {
//         case .basicAuth:
//             return "/basic-auth/user/passwd"
//         case .post, .upload, .uploadMultipart:
//             return "/post"
//         }
//     }

//     var method: Moya.Method {
//         switch self {
//         case .basicAuth:
//             return .get
//         case .post, .upload, .uploadMultipart:
//             return .post
//         }
//     }

//     var task: Task {
//         switch self {
//         case .basicAuth, .post:
//         return .requestParameters(parameters: [:], encoding: URLEncoding.default)
//         case .upload(let fileURL):
//             return .uploadFile(fileURL)
//         case .uploadMultipart(let data, let urlParameters):
//             if let urlParameters = urlParameters {
//                 return .uploadCompositeMultipart(data, urlParameters: urlParameters)
//             } else {
//                 return .uploadMultipart(data)
//             }
//         }
//     }

//     var sampleData: Data {
//         switch self {
//         case .basicAuth:
//             return "{\"authenticated\": true, \"user\": \"user\"}".data(using: String.Encoding.utf8)!
//         case .post, .upload, .uploadMultipart:
//             return "{\"args\": {}, \"data\": \"\", \"files\": {}, \"form\": {}, \"headers\": { \"Connection\": \"close\", \"Content-Length\": \"0\", \"Host\": \"httpbin.org\" },  \"json\": null, \"origin\": \"198.168.1.1\", \"url\": \"https://httpbin.org/post\"}".data(using: String.Encoding.utf8)!
//         }
//     }

//     var headers: [String: String]? {
//         return nil
//     }
// }

// public enum GitHubUserContent {
//     case downloadMoyaWebContent(String)
//     case requestMoyaWebContent(String)
// }

// extension GitHubUserContent: TargetType {
//     public var baseURL: URL { return URL(string: "https://raw.githubusercontent.com")! }
//     public var path: String {
//         switch self {
//         case .downloadMoyaWebContent(let contentPath), .requestMoyaWebContent(let contentPath):
//             return "/Moya/Moya/master/web/\(contentPath)"
//         }
//     }
//     public var method: Moya.Method {
//         switch self {
//         case .downloadMoyaWebContent, .requestMoyaWebContent:
//             return .get
//         }
//     }
//     public var parameters: [String: Any]? {
//         switch self {
//         case .downloadMoyaWebContent, .requestMoyaWebContent:
//             return nil
//         }
//     }
//     public var parameterEncoding: ParameterEncoding {
//         return URLEncoding.default
//     }
//     public var task: Task {
//         switch self {
//         case .downloadMoyaWebContent:
//             return .downloadDestination(defaultDownloadDestination)
//         case .requestMoyaWebContent:
//             return .requestPlain
//         }
//     }
//     public var sampleData: Data {
//         switch self {
//         case .downloadMoyaWebContent, .requestMoyaWebContent:
//             return Data(count: 4000)
//         }
//     }

//     public var headers: [String: String]? {
//         return nil
//     }
// }

// // MARK: - String Helpers
// extension String {
//     var urlEscaped: String {
//         return self.addingPercentEncoding(withAllowedCharacters: .urlHostAllowed)!
//     }
// }

// // MARK: - DispatchQueue Test Helpers
// // https://lists.swift.org/pipermail/swift-users/Week-of-Mon-20160613/002280.html
// extension DispatchQueue {
//     class var currentLabel: String? {
//         return String(validatingUTF8: __dispatch_queue_get_label(nil))
//     }
// }

// private let defaultDownloadDestination: DownloadDestination = { temporaryURL, response in
//     let directoryURLs = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask)

//     if !directoryURLs.isEmpty {
//         return (directoryURLs.first!.appendingPathComponent(response.suggestedFilename!), [])
//     }

//     return (temporaryURL, [])
// }

// // MARK: - Image Test Helpers
// // Necessary since Image(named:) doesn't work correctly in the test bundle
// extension ImageType {
//     class TestClass { }

//     class func testPNGImage(named name: String) -> ImageType {
//         let bundle = Bundle(for: type(of: TestClass()))
//         let path = bundle.path(forResource: name, ofType: "png")
//         return Image(contentsOfFile: path!)!
//     }

//     #if os(iOS) || os(watchOS) || os(tvOS)
//         func asJPEGRepresentation(_ compression: CGFloat) -> Data? {
//             return UIImageJPEGRepresentation(self, compression)
//         }
//     #elseif os(OSX)
//         func asJPEGRepresentation(_ compression: CGFloat) -> Data? {
//             var imageRect = CGRect(x: 0, y: 0, width: self.size.width, height: self.size.height)
//             let imageRep = NSBitmapImageRep(cgImage: self.cgImage(forProposedRect: &imageRect, context: nil, hints: nil)!)
//             return imageRep.representation(using: .JPEG, properties: [:])
//         }
//     #endif
// }

// // A fixture for testing Decodable mapping
// struct Issue: Codable {
//     let title: String
//     let createdAt: Date
// }
