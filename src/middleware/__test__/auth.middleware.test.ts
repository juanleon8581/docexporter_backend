import { Request, Response, NextFunction } from "express";
import { AuthMiddleware } from "../auth.middleware";
import { JwtAdapter } from "@/config/adapters/jwt.adapter";
import envs from "@/config/envs";

// Mock dependencies
jest.mock("@/config/adapters/jwt.adapter");
jest.mock("@/config/envs", () => ({
  JWT_SECRET: "test-secret-key",
}));

describe("AuthMiddleware", () => {
  // Setup mocks
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      header: jest.fn(),
      user: undefined,
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();

    // Reset mocks
    jest.clearAllMocks();
  });

  it("should return 401 if no authorization header is provided", () => {
    // Arrange
    // @ts-ignore
    mockRequest.header.mockReturnValue(undefined);

    // Act
    AuthMiddleware.validateJWT(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "No token provided",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if authorization header does not start with "Bearer "', () => {
    // Arrange
    // @ts-ignore
    mockRequest.header.mockReturnValue("InvalidToken");

    // Act
    AuthMiddleware.validateJWT(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Invalid Bearer token format",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 401 if token validation returns null payload", async () => {
    // Arrange
    // @ts-ignore
    mockRequest.header.mockReturnValue("Bearer validToken");
    // @ts-ignore
    JwtAdapter.validateToken.mockResolvedValue(null);

    // Act
    await AuthMiddleware.validateJWT(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Assert
    expect(JwtAdapter.validateToken).toHaveBeenCalledWith(
      "validToken",
      envs.JWT_SECRET
    );
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Invalid or expired token",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should set user in request and call next() if token is valid", async () => {
    // Arrange
    const mockPayload = { id: "123", email: "test@example.com" };
    // @ts-ignore
    mockRequest.header.mockReturnValue("Bearer validToken");
    // @ts-ignore
    JwtAdapter.validateToken.mockResolvedValue(mockPayload);

    // Act
    await AuthMiddleware.validateJWT(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Assert
    expect(JwtAdapter.validateToken).toHaveBeenCalledWith(
      "validToken",
      envs.JWT_SECRET
    );
    expect(mockRequest.user).toEqual(mockPayload);
    expect(mockNext).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  it("should return 500 if token validation throws an error", async () => {
    // Arrange
    const mockError = new Error("Validation error");
    // @ts-ignore
    mockRequest.header.mockReturnValue("Bearer validToken");
    // @ts-ignore
    JwtAdapter.validateToken.mockRejectedValue(mockError);

    // Act
    await AuthMiddleware.validateJWT(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Assert
    expect(JwtAdapter.validateToken).toHaveBeenCalledWith(
      "validToken",
      envs.JWT_SECRET
    );

    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should extract token correctly from authorization header", async () => {
    // Arrange
    const mockPayload = { id: "123", email: "test@example.com" };
    // @ts-ignore
    mockRequest.header.mockReturnValue("Bearer tokenValue123");
    // @ts-ignore
    JwtAdapter.validateToken.mockResolvedValue(mockPayload);

    // Act
    await AuthMiddleware.validateJWT(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Assert
    expect(JwtAdapter.validateToken).toHaveBeenCalledWith(
      "tokenValue123",
      envs.JWT_SECRET
    );
    expect(mockRequest.user).toEqual(mockPayload);
    expect(mockNext).toHaveBeenCalled();
  });
});
