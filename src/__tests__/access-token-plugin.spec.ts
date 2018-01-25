// import { Method } from "../method";
// import { TargetType } from "../target-type";

//     class TestTarget implements TargetType, AccessTokenAuthorizable {
//         let baseURL = new URL(string: "http://www.api.com/")!
//         let path = ""
//         let method = Method.get
//         let task = Task.requestPlain
//         let sampleData = Data()
//         let headers: [String: String]? = nil

//         let authorizationType: AuthorizationType
//     }

//     describe("Access Token Plugin", () => {
//         let token = "eyeAm.AJsoN.weBTOKen"
//         let plugin = AccessTokenPlugin(tokenClosure: token)

//         it("doesn't add an authorization header to TargetTypes by default") {
//             let target = GitHub.zen
//             let request = URLRequest(url: target.baseURL)
//             let preparedRequest = plugin.prepare(request, target: target)
//             expect(preparedRequest.allHTTPHeaderFields).to(beNil())
//         }

//         it("doesn't add an authorization header to AccessTokenAuthorizables when AuthorizationType is .none") {
//             let target = TestTarget(authorizationType: .none)
//             let request = URLRequest(url: target.baseURL)
//             let preparedRequest = plugin.prepare(request, target: target)
//             expect(preparedRequest.allHTTPHeaderFields).to(beNil())
//         }

//         it("adds a bearer authorization header to AccessTokenAuthorizables when AuthorizationType is .bearer") {
//             let target = TestTarget(authorizationType: .bearer)
//             let request = URLRequest(url: target.baseURL)
//             let preparedRequest = plugin.prepare(request, target: target)
//             expect(preparedRequest.allHTTPHeaderFields) == ["Authorization": "Bearer eyeAm.AJsoN.weBTOKen"]
//         }

//         it("adds a basic authorization header to AccessTokenAuthorizables when AuthorizationType is .basic") {
//             let target = TestTarget(authorizationType: .basic)
//             let request = URLRequest(url: target.baseURL)
//             let preparedRequest = plugin.prepare(request, target: target)
//             expect(preparedRequest.allHTTPHeaderFields) == ["Authorization": "Basic eyeAm.AJsoN.weBTOKen"]
//         }

//     })
