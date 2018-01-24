export enum ResultType {
  Succuss,
  Failure
}

export type Result<T, K extends Error> =
  | { case: ResultType.Succuss; value: T }
  | { case: ResultType.Failure; error: K };
