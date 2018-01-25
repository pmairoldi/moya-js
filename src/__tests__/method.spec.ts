import { Method } from "../method";

describe("Method", () => {
  describe("supportsMultipart", () => {
    let expectations: [Method, boolean][] = [
      [Method.Get, false],
      [Method.Post, true],
      [Method.Put, true],
      [Method.Delete, false],
      [Method.Options, false],
      [Method.Head, false],
      [Method.Patch, true],
      [Method.Trace, false],
      [Method.Connect, true]
    ];

    expectations.forEach(expectation => {
      let method = expectation[0];
      let expected = expectation[1];

      it(`${method} should ${expected ? "" : "not"} support multipart`, () => {
        expect(method.supportsMultipart).toEqual(expected);
      });
    });
  });
});
