import { NotFoundError } from "../not-found-error";
import { CustomError } from "../custom-error";

describe("NotFoundError", () => {
  describe("constructor", () => {
    it("should create an instance with the provided message", () => {
      const errorMessage = "Resource not found";
      const error = new NotFoundError(errorMessage);

      expect(error.message).toBe(errorMessage);
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error).toBeInstanceOf(CustomError);
      expect(error).toBeInstanceOf(Error);
    });

    it("should handle empty message", () => {
      const error = new NotFoundError("");

      expect(error.message).toBe("");
    });

    it("should handle message with special characters", () => {
      const specialMessage = "Error!@#$%^&*()\n\t";
      const error = new NotFoundError(specialMessage);

      expect(error.message).toBe(specialMessage);
    });
  });
});
