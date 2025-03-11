import { CustomError } from "../custom-error";

// Create a concrete implementation of CustomError for testing
class TestError extends CustomError {
  constructor(message: string) {
    super(message);
  }

  getStatusCode(): number {
    return 500;
  }

  serializeErrors(): { message: string; field?: string }[] {
    return [{ message: this.message }];
  }
}

describe("CustomError", () => {
  describe("constructor", () => {
    it("should set the error message correctly", () => {
      const errorMessage = "Test error message";
      const error = new TestError(errorMessage);

      expect(error.message).toBe(errorMessage);
      expect(error.name).toBe("TestError");
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(CustomError);
      expect(error).toBeInstanceOf(TestError);
    });

    it("should handle empty message", () => {
      const error = new TestError("");

      expect(error.message).toBe("");
    });

    it("should handle message with special characters", () => {
      const specialMessage = "Error!@#$%^&*()\n\t";
      const error = new TestError(specialMessage);

      expect(error.message).toBe(specialMessage);
    });

    it("should properly set up the prototype chain", () => {
      const error = new TestError("Test error");

      // Test that instanceof works correctly
      expect(Object.getPrototypeOf(error)).toBe(TestError.prototype);
      expect(Object.getPrototypeOf(Object.getPrototypeOf(error))).toBe(
        CustomError.prototype
      );
      expect(
        Object.getPrototypeOf(
          Object.getPrototypeOf(Object.getPrototypeOf(error))
        )
      ).toBe(Error.prototype);
    });

    it("should allow calling Error methods", () => {
      const error = new TestError("Test error");

      // Error.prototype.toString() should work
      expect(error.toString()).toContain("TestError: Test error");
    });

    it("should preserve stack trace", () => {
      const error = new TestError("Test error");

      // Stack trace should exist
      expect(error.stack).toBeDefined();
      // Stack should contain the error message
      expect(error.stack).toContain("Test error");
    });
  });
});
