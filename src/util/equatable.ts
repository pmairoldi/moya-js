export interface Equatable<T> {
  equals(lhs: T, rhs: T): boolean;
}
