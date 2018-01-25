export enum ResultType {
  Success,
  Failure
}

export class Success<T> {
  readonly type: ResultType.Success;

  constructor(public value: T) {}
}

export class Failure<T extends Error> {
  readonly type: ResultType.Failure;

  constructor(public error: T) {}
}

export type Result<T, K extends Error> = Success<T> | Failure<K>;
