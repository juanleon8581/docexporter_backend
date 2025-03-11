import { UnauthorizedError } from "../unauthorized-error";
import { CustomError } from "../custom-error";

describe("UnauthorizedError", () => {
  describe("constructor", () => {
    it("should create an instance with the provided message", () => {
      const errorMessage = "Access denied";
      const error = new UnauthorizedError(errorMessage);

      expect(error.message).toBe(errorMessage);
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(CustomError);
      expect(error).toBeInstanceOf(UnauthorizedError);
    });

    it("should handle empty message", () => {
      const error = new UnauthorizedError("");

      expect(error.message).toBe("");
    });

    it("should handle message with special characters", () => {
      const specialMessage = "Unauthorized!@#$%^&*()\n\t";
      const error = new UnauthorizedError(specialMessage);

      expect(error.message).toBe(specialMessage);
    });

    it("should preserve message case sensitivity", () => {
      const mixedCaseMessage = "UnAuthorized Access DENIED";
      const error = new UnauthorizedError(mixedCaseMessage);

      expect(error.message).toBe(mixedCaseMessage);
    });
  });
});
