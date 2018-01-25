import { PluginType, RequestType } from "../plugin";
import { TargetType } from "../target-type";
import { MoyaError } from "../moya-error";
import { Result } from "../util/result";
import { MoyaResponse } from "../moya-response";

// MARK: - AccessTokenAuthorizable

/// A protocol for controlling the behavior of `AccessTokenPlugin`.
export interface AccessTokenAuthorizable extends TargetType {
  /// Represents the authorization header to use for requests.
  readonly authorizationType: AuthorizationType;
}

// MARK: - AuthorizationType

/// An enum representing the header to use with an `AccessTokenPlugin`
export enum AuthorizationType {
  /// No header.
  None,

  /// The `"Basic"` header.
  Basic = "Basic",

  /// The `"Bearer"` header.
  Bearer = "Bearer"
}

// MARK: - AccessTokenPlugin

/**
 A plugin for adding basic or bearer-type authorization headers to requests. Example:

 ```
 Authorization: Bearer <token>
 Authorization: Basic <token>
 ```

*/
export class AccessTokenPlugin implements PluginType {
  /// A closure returning the access token to be applied in the header.
  readonly tokenClosure: () => string;

  /**
     Initialize a new `AccessTokenPlugin`.

     - parameters:
       - tokenClosure: A closure returning the token to be applied in the pattern `Authorization: <AuthorizationType> <token>`
    */
  constructor(tokenClosure: () => string) {
    this.tokenClosure = tokenClosure;
  }

  /**
     Prepare a request by adding an authorization header if necessary.

     - parameters:
       - request: The request to modify.
       - target: The target of the request.
     - returns: The modified `URLRequest`.
    */
  prepare(request: Request, target: TargetType): Request {
    if (!this.isAccessTokenAuthorizable(target)) {
      return request;
    }

    let authorizable = target as AccessTokenAuthorizable;
    let authorizationType = authorizable.authorizationType;

    switch (authorizationType) {
      case AuthorizationType.Basic:
      case AuthorizationType.Bearer:
        let authValue = authorizationType.toString() + " " + this.tokenClosure();
        request.headers.append("Authorization", authValue);
      case AuthorizationType.None:
        break;
    }

    return request;
  }

  private isAccessTokenAuthorizable(target: TargetType): target is AccessTokenAuthorizable {
    return (<AccessTokenAuthorizable>target).authorizationType !== undefined;
  }
}
