import { ErrorHandler } from "../error-handler";
import { CustomError } from "../custom-error";

// Create a concrete implementation of CustomError for testing
class TestCustomError extends CustomError {
  constructor(private readonly statusCode: number, message: string) {
    super(message);
  }

  getStatusCode(): number {
    return this.statusCode;
  }

  serializeErrors(): { message: string; field?: string }[] {
    return [{ message: this.message }];
  }
}

// Create a custom error with field property for testing
class ValidationError extends CustomError {
  constructor(message: string, private readonly fieldName: string) {
    super(message);
  }

  getStatusCode(): number {
    return 400;
  }

  serializeErrors(): { message: string; field?: string }[] {
    return [{ message: this.message, field: this.fieldName }];
  }
}

describe("ErrorHandler", () => {
  describe("handle", () => {
    it("should handle CustomError instances correctly", () => {
      const statusCode = 404;
      const errorMessage = "Resource not found";
      const error = new TestCustomError(statusCode, errorMessage);

      const result = ErrorHandler.handle(error);

      expect(result).toEqual({
        status: "error",
        code: statusCode,
        errors: [{ message: errorMessage }],
      });
    });

    it("should handle CustomError with field property", () => {
      const errorMessage = "Invalid input";
      const fieldName = "email";
      const error = new ValidationError(errorMessage, fieldName);

      const result = ErrorHandler.handle(error);

      expect(result).toEqual({
        status: "error",
        code: 400,
        errors: [{ message: errorMessage, field: fieldName }],
      });
    });

    it("should handle multiple errors in serializeErrors", () => {
      // Create a custom error that returns multiple errors
      class MultipleErrorsCustomError extends CustomError {
        constructor() {
          super("Multiple errors");
        }

        getStatusCode(): number {
          return 400;
        }

        serializeErrors(): { message: string; field?: string }[] {
          return [
            { message: "Error 1", field: "field1" },
            { message: "Error 2", field: "field2" },
          ];
        }
      }

      const error = new MultipleErrorsCustomError();
      const result = ErrorHandler.handle(error);

      expect(result).toEqual({
        status: "error",
        code: 400,
        errors: [
          { message: "Error 1", field: "field1" },
          { message: "Error 2", field: "field2" },
        ],
      });
    });

    it("should handle non-CustomError instances with default error response", () => {
      const errors = [
        new Error("Standard JS error"),
        "String error",
        123,
        null,
        undefined,
        { custom: "error object" },
      ];

      errors.forEach((error) => {
        const result = ErrorHandler.handle(error);

        expect(result).toEqual({
          status: "error",
          code: 500,
          errors: [{ message: "Internal Server Error" }],
        });
      });
    });

    it("should handle Error instances as non-CustomError", () => {
      const jsError = new Error("Standard JS error");

      const result = ErrorHandler.handle(jsError);

      expect(result).toEqual({
        status: "error",
        code: 500,
        errors: [{ message: "Internal Server Error" }],
      });
    });

    it("should call getStatusCode and serializeErrors methods on CustomError", () => {
      const statusCode = 403;
      const errorMessage = "Forbidden";
      const error = new TestCustomError(statusCode, errorMessage);

      // Spy on the methods
      const getStatusCodeSpy = jest.spyOn(error, "getStatusCode");
      const serializeErrorsSpy = jest.spyOn(error, "serializeErrors");

      ErrorHandler.handle(error);

      expect(getStatusCodeSpy).toHaveBeenCalledTimes(1);
      expect(serializeErrorsSpy).toHaveBeenCalledTimes(1);

      // Clean up
      getStatusCodeSpy.mockRestore();
      serializeErrorsSpy.mockRestore();
    });
  });
});
