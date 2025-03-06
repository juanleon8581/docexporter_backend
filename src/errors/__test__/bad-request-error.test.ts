import { BadRequestError } from "../bad-request-error";

describe("BadRequestError", () => {
  describe("constructor", () => {
    it("should set the error message correctly", () => {
      const errorMessage = "Invalid input";
      const error = new BadRequestError(errorMessage);

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(BadRequestError);
      expect(error.message).toBe(errorMessage);
    });
  });

  describe("getStatusCode", () => {
    it("should return 400", () => {
      const error = new BadRequestError("Test error");

      expect(error.getStatusCode()).toBe(400);
    });
  });

  describe("serializeErrors", () => {
    it("should return an array with the error message", () => {
      const errorMessage = "Invalid input";
      const error = new BadRequestError(errorMessage);

      const serialized = error.serializeErrors();

      expect(serialized).toEqual([{ message: errorMessage }]);
    });

    it("should not include a field property when not provided", () => {
      const error = new BadRequestError("Test error");

      const serialized = error.serializeErrors();

      expect(serialized[0].field).toBeUndefined();
    });
  });
});
