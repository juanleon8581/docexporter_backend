import { Request, Response, NextFunction } from "express";
import { ErrorMiddleware } from "../error.middleware";
import { ErrorHandler } from "@/errors/error-handler";

// Mock the ErrorHandler
jest.mock("@/errors/error-handler", () => ({
  ErrorHandler: {
    handle: jest.fn(),
  },
}));

describe("ErrorMiddleware", () => {
  // Setup mocks
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();

    // Reset mocks
    jest.clearAllMocks();
  });

  it("should handle a standard error and return the appropriate response", () => {
    // Arrange
    const mockError = new Error("Test error");
    const mockErrorResponse = {
      code: 500,
      message: "Internal Server Error",
      error: "Test error",
    };

    // @ts-ignore
    ErrorHandler.handle.mockReturnValue(mockErrorResponse);

    // Act
    ErrorMiddleware.handleError(
      mockError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Assert
    expect(ErrorHandler.handle).toHaveBeenCalledWith(mockError);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(mockErrorResponse);
  });

  it("should handle a custom error with a different status code", () => {
    // Arrange
    const mockError = new Error("Not Found");
    const mockErrorResponse = {
      code: 404,
      message: "Resource Not Found",
      error: "Not Found",
    };

    // @ts-ignore
    ErrorHandler.handle.mockReturnValue(mockErrorResponse);

    // Act
    ErrorMiddleware.handleError(
      mockError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Assert
    expect(ErrorHandler.handle).toHaveBeenCalledWith(mockError);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith(mockErrorResponse);
  });

  it("should handle a non-Error object", () => {
    // Arrange
    const mockError = { message: "Custom error object" };
    const mockErrorResponse = {
      code: 500,
      message: "Internal Server Error",
      error: "Custom error object",
    };

    // @ts-ignore
    ErrorHandler.handle.mockReturnValue(mockErrorResponse);

    // Act
    ErrorMiddleware.handleError(
      mockError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Assert
    expect(ErrorHandler.handle).toHaveBeenCalledWith(mockError);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(mockErrorResponse);
  });

  it("should handle a string error", () => {
    // Arrange
    const mockError = "String error message";
    const mockErrorResponse = {
      code: 500,
      message: "Internal Server Error",
      error: "String error message",
    };

    // @ts-ignore
    ErrorHandler.handle.mockReturnValue(mockErrorResponse);

    // Act
    ErrorMiddleware.handleError(
      mockError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Assert
    expect(ErrorHandler.handle).toHaveBeenCalledWith(mockError);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(mockErrorResponse);
  });

  it("should handle null or undefined errors", () => {
    // Arrange
    const mockError = null;
    const mockErrorResponse = {
      code: 500,
      message: "Unknown Error",
      error: null,
    };

    // @ts-ignore
    ErrorHandler.handle.mockReturnValue(mockErrorResponse);

    // Act
    ErrorMiddleware.handleError(
      mockError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Assert
    expect(ErrorHandler.handle).toHaveBeenCalledWith(mockError);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(mockErrorResponse);
  });
});
