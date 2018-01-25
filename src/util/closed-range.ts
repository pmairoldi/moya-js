export class ClosedRange {
  private start: number;
  private end: number;

  constructor(start: number, end: number) {
    this.start = start;
    this.end = end;
  }

  contains(value: number): boolean {
    return value >= this.start && value <= this.end;
  }
}
