import { Request, Response } from "express";
import { AuthController } from "../controller";
import { RegisterDto } from "@/domain/dtos/auth/register.dto";
import { RegisterAuth } from "@/domain/use-cases/auth/register-auth";
import { AuthRepository } from "@/domain/repositories/auth.repository";

// Mock dependencies
jest.mock("@/domain/dtos/auth/register.dto");
jest.mock("@/domain/use-cases/auth/register-auth");

describe("AuthController - register method", () => {
  // Setup mocks
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockRepository: jest.Mocked<AuthRepository>;
  let authController: AuthController;
  let mockRegisterAuth: jest.Mock;
  let mockExecute: jest.Mock;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup request and response mocks
    mockRequest = {
      body: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    // Setup repository mock
    mockRepository = {} as jest.Mocked<AuthRepository>;

    // Setup RegisterAuth mock
    mockExecute = jest.fn();
    mockRegisterAuth = jest.fn().mockImplementation(() => ({
      execute: mockExecute,
    }));
    // @ts-ignore
    RegisterAuth.mockImplementation(mockRegisterAuth);

    // Create controller instance
    authController = new AuthController(mockRepository);
  });

  it("should return 400 if RegisterDto.create returns an error", () => {
    // Arrange
    const mockError = "Validation error";
    // @ts-ignore
    RegisterDto.create.mockReturnValue([mockError, null]);

    // Act
    authController.register(mockRequest as Request, mockResponse as Response);

    // Assert
    expect(RegisterDto.create).toHaveBeenCalledWith(mockRequest.body);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: mockError });
    expect(RegisterAuth).not.toHaveBeenCalled();
  });

  it("should call RegisterAuth.execute and return success response", async () => {
    // Arrange
    const mockRegisterDto = {
      email: "test@example.com",
      password: "password123",
    };
    const mockAuthResponse = {
      user: { id: "123", email: "test@example.com" },
      token: "jwt-token",
    };

    // @ts-ignore
    RegisterDto.create.mockReturnValue([null, mockRegisterDto]);
    mockExecute.mockResolvedValue(mockAuthResponse);

    // Act
    await authController.register(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(RegisterDto.create).toHaveBeenCalledWith(mockRequest.body);
    expect(RegisterAuth).toHaveBeenCalledWith(mockRepository);
    expect(mockExecute).toHaveBeenCalledWith(mockRegisterDto);
    expect(mockResponse.json).toHaveBeenCalledWith(mockAuthResponse);
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it("should return 400 if RegisterAuth.execute throws an error", async () => {
    // Arrange
    const mockRegisterDto = {
      email: "test@example.com",
      password: "password123",
    };
    const mockError = new Error("Registration failed");

    // @ts-ignore
    RegisterDto.create.mockReturnValue([null, mockRegisterDto]);
    mockExecute.mockRejectedValue(mockError);

    // Act
    await authController.register(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(RegisterDto.create).toHaveBeenCalledWith(mockRequest.body);
    expect(RegisterAuth).toHaveBeenCalledWith(mockRepository);
    expect(mockExecute).toHaveBeenCalledWith(mockRegisterDto);
  });

  it("should handle valid registration data correctly", async () => {
    // Arrange
    const validRequestBody = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };
    mockRequest.body = validRequestBody;

    const mockRegisterDto = { ...validRequestBody };
    const mockAuthResponse = {
      user: { id: "123", name: "Test User", email: "test@example.com" },
      token: "jwt-token",
    };

    // @ts-ignore
    RegisterDto.create.mockReturnValue([null, mockRegisterDto]);
    mockExecute.mockResolvedValue(mockAuthResponse);

    // Act
    await authController.register(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(RegisterDto.create).toHaveBeenCalledWith(validRequestBody);
    expect(mockExecute).toHaveBeenCalledWith(mockRegisterDto);
    expect(mockResponse.json).toHaveBeenCalledWith(mockAuthResponse);
  });
});
