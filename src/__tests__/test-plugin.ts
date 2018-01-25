import { PluginType, RequestType } from "../plugin";
import { TargetType } from "../target-type";
import { Result, ResultType, Success } from "../util/result";
import { MoyaError } from "../moya-error";
import { MoyaResponse } from "../moya-response";

export class TestingPlugin implements PluginType {
  request?: [RequestType, TargetType];
  result?: Result<MoyaResponse, MoyaError>;
  didPrepare = false;

  prepare(request: Request, target: TargetType): Request {
    request.headers.append("prepared", "yes");
    return request;
  }

  willSend(request: RequestType, target: TargetType) {
    this.request = [request, target];

    // We check for whether or not we did prepare here to make sure prepare gets called
    // before willSend
    // this.didPrepare = request.request?.headers["prepared"] == "yes"
  }

  didReceive(result: Result<MoyaResponse, MoyaError>, target: TargetType) {
    this.result = result;
  }

  process(result: Result<MoyaResponse, MoyaError>, target: TargetType): Result<MoyaResponse, MoyaError> {
    switch (result.type) {
      case ResultType.Success:
        let response = result.value;
        let processedResponse = new MoyaResponse(-1, response.data, response.request, response.response);
        result = new Success(processedResponse);
    }

    return result;
  }
}
