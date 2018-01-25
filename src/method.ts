/// Represents an HTTP method.
export enum Method {
  Options = "OPTIONS",
  Get = "GET",
  Head = "HEAD",
  Post = "POST",
  Put = "PUT",
  Patch = "PATCH",
  Delete = "DELETE",
  Trace = "TRACE",
  Connect = "CONNECT"
}

export namespace Method {
  export function supportsMultipart(method: Method): boolean {
    switch (method) {
      case Method.Options:
      case Method.Get:
      case Method.Head:
      case Method.Delete:
      case Method.Trace:
        return false;
      case Method.Post:
      case Method.Put:
      case Method.Patch:
      case Method.Connect:
        return true;
    }
  }
}
