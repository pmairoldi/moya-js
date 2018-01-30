export enum ResultEnum {
  Success,
  Failure
}

export interface Success<T> {
  readonly type: ResultEnum.Success;
  readonly value: T;
}

export interface Failure<T extends Error> {
  readonly type: ResultEnum.Failure;
  readonly error: T;
}

export type ResultType<T, K extends Error> = Success<T> | Failure<K>;

export class Result<T, K extends Error> {
  static success<T, K extends Error>(value: T): Result<T, K> {
    return new Result({ type: ResultEnum.Success, value: value });
  }

  static failure<T, K extends Error>(error: K): Result<T, K> {
    return new Result({ type: ResultEnum.Failure, error: error });
  }

  private constructor(public type: ResultType<T, K>) {}
}
