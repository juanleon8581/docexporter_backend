import { Request, Response } from "express";
import { AuthController } from "../controller";
import { LogoutDto } from "@/domain/dtos/auth/logout.dto";
import { AuthRepository } from "@/domain/repositories/auth.repository";
import { LogoutAuth } from "@/domain/use-cases/auth/logout-auth";

// Mock dependencies
jest.mock("@/domain/dtos/auth/logout.dto");
jest.mock("@/domain/use-cases/auth/logout-auth");

describe("AuthController - logout", () => {
  // Setup mocks
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockRepository: jest.Mocked<AuthRepository>;
  let authController: AuthController;
  let mockLogoutAuthExecute: jest.Mock;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup request and response mocks
    mockRequest = {
      headers: {
        authorization: "Bearer test-token",
      },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    // Setup repository mock
    // @ts-ignore
    mockRepository = {} as jest.Mocked<AuthRepository>;

    // Setup LogoutAuth mock
    mockLogoutAuthExecute = jest.fn();
    // @ts-ignore
    LogoutAuth.prototype.execute = mockLogoutAuthExecute;

    // Create controller instance
    authController = new AuthController(mockRepository);
  });

  it("should successfully logout when valid token is provided", async () => {
    // Arrange
    const mockLogoutDto = { accessToken: "test-token" };
    // @ts-ignore
    LogoutDto.create.mockReturnValue([null, mockLogoutDto]);
    mockLogoutAuthExecute.mockResolvedValue(undefined);

    // Act
    await authController.logout(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(LogoutDto.create).toHaveBeenCalledWith({
      accessToken: "test-token",
    });
    expect(LogoutAuth).toHaveBeenCalledWith(mockRepository);
    expect(mockLogoutAuthExecute).toHaveBeenCalledWith(mockLogoutDto);
    expect(mockResponse.status).toHaveBeenCalledWith(204);
    expect(mockResponse.send).toHaveBeenCalled();
  });

  it("should return 400 when LogoutDto.create returns an error", async () => {
    // Arrange
    const validationError = "Invalid token format";
    // @ts-ignore
    LogoutDto.create.mockReturnValue([validationError, null]);

    // Act
    await authController.logout(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(LogoutDto.create).toHaveBeenCalledWith({
      accessToken: "test-token",
    });
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: validationError });
    expect(LogoutAuth).not.toHaveBeenCalled();
  });

  it("should return 400 when LogoutAuth.execute throws an error", async () => {
    // Arrange
    const mockLogoutDto = { accessToken: "test-token" };
    const executionError = new Error("Token revocation failed");

    // @ts-ignore
    LogoutDto.create.mockReturnValue([null, mockLogoutDto]);
    mockLogoutAuthExecute.mockRejectedValue(executionError);

    // Act
    await authController.logout(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(LogoutDto.create).toHaveBeenCalledWith({
      accessToken: "test-token",
    });
    expect(LogoutAuth).toHaveBeenCalledWith(mockRepository);
    expect(mockLogoutAuthExecute).toHaveBeenCalledWith(mockLogoutDto);
  });

  it("should handle missing authorization header", async () => {
    // Arrange
    mockRequest.headers = {}; // No authorization header
    // @ts-ignore
    LogoutDto.create.mockReturnValue([null, { accessToken: undefined }]);
    mockLogoutAuthExecute.mockResolvedValue(undefined);

    // Act
    await authController.logout(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(LogoutDto.create).toHaveBeenCalledWith({ accessToken: undefined });
    expect(LogoutAuth).toHaveBeenCalledWith(mockRepository);
    expect(mockLogoutAuthExecute).toHaveBeenCalledWith({
      accessToken: undefined,
    });
    expect(mockResponse.status).toHaveBeenCalledWith(204);
    expect(mockResponse.send).toHaveBeenCalled();
  });

  it("should handle malformed authorization header", async () => {
    // Arrange
    mockRequest.headers = { authorization: "InvalidFormat" }; // No "Bearer " prefix
    // @ts-ignore
    LogoutDto.create.mockReturnValue([null, { accessToken: undefined }]);
    mockLogoutAuthExecute.mockResolvedValue(undefined);

    // Act
    await authController.logout(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(LogoutDto.create).toHaveBeenCalledWith({ accessToken: undefined });
    expect(LogoutAuth).toHaveBeenCalledWith(mockRepository);
    expect(mockLogoutAuthExecute).toHaveBeenCalledWith({
      accessToken: undefined,
    });
    expect(mockResponse.status).toHaveBeenCalledWith(204);
    expect(mockResponse.send).toHaveBeenCalled();
  });
});
