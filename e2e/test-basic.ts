import assert from "assert";
import { describe, it } from "mocha";

describe("Array", () => {
  describe("#indexOf()", () => {
    it("Should return -1 when value not present", () => {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});
