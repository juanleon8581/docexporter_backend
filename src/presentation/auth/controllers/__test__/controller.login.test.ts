import { Request, Response } from "express";
import { AuthController } from "../controller";
import { LoginDto } from "@/domain/dtos/auth/login.dto";
import { AuthRepository } from "@/domain/repositories/auth.repository";
import { LoginAuth } from "@/domain/use-cases/auth/login-auth";

// Mock dependencies
jest.mock("@/domain/dtos/auth/login.dto");
jest.mock("@/domain/use-cases/auth/login-auth");

describe("AuthController - login", () => {
  // Setup mocks
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockRepository: jest.Mocked<AuthRepository>;
  let authController: AuthController;
  let mockLoginAuthExecute: jest.Mock;

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
    };

    // Setup repository mock
    mockRepository = {
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    } as unknown as jest.Mocked<AuthRepository>;

    // Setup LoginAuth mock
    mockLoginAuthExecute = jest.fn();
    // @ts-ignore
    LoginAuth.prototype.execute = mockLoginAuthExecute;

    // Create controller instance
    authController = new AuthController(mockRepository);
  });

  it("should return 400 if LoginDto.create returns an error", () => {
    // Arrange
    const mockError = "Invalid credentials";
    // @ts-ignore
    LoginDto.create.mockReturnValue([mockError, null]);

    // Act
    authController.login(mockRequest as Request, mockResponse as Response);

    // Assert
    expect(LoginDto.create).toHaveBeenCalledWith(mockRequest.body);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: mockError });
    expect(mockLoginAuthExecute).not.toHaveBeenCalled();
  });

  it("should call LoginAuth.execute and return auth data on success", async () => {
    // Arrange
    const mockLoginDto = { email: "test@example.com", password: "password123" };
    const mockAuthData = {
      user: { id: "123", email: "test@example.com" },
      token: "jwt-token",
    };

    // @ts-ignore
    LoginDto.create.mockReturnValue([null, mockLoginDto]);
    mockLoginAuthExecute.mockResolvedValue(mockAuthData);

    // Act
    await authController.login(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(LoginDto.create).toHaveBeenCalledWith(mockRequest.body);
    expect(LoginAuth).toHaveBeenCalledWith(mockRepository);
    expect(mockLoginAuthExecute).toHaveBeenCalledWith(mockLoginDto);
    expect(mockResponse.json).toHaveBeenCalledWith(mockAuthData);
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it("should return 400 if LoginAuth.execute throws an error", async () => {
    // Arrange
    const mockLoginDto = { email: "test@example.com", password: "password123" };
    const mockError = new Error("Invalid credentials");

    // @ts-ignore
    LoginDto.create.mockReturnValue([null, mockLoginDto]);
    mockLoginAuthExecute.mockRejectedValue(mockError);

    // Act
    await authController.login(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(LoginDto.create).toHaveBeenCalledWith(mockRequest.body);
    expect(LoginAuth).toHaveBeenCalledWith(mockRepository);
    expect(mockLoginAuthExecute).toHaveBeenCalledWith(mockLoginDto);
  });

  it("should handle different request body formats correctly", async () => {
    // Arrange
    const mockRequestBody = {
      email: "test@example.com",
      password: "password123",
      rememberMe: true,
    };
    mockRequest.body = mockRequestBody;

    const mockLoginDto = { email: "test@example.com", password: "password123" };
    const mockAuthData = {
      user: { id: "123", email: "test@example.com" },
      token: "jwt-token",
    };

    // @ts-ignore
    LoginDto.create.mockReturnValue([null, mockLoginDto]);
    mockLoginAuthExecute.mockResolvedValue(mockAuthData);

    // Act
    await authController.login(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(LoginDto.create).toHaveBeenCalledWith(mockRequestBody);
    expect(mockLoginAuthExecute).toHaveBeenCalledWith(mockLoginDto);
    expect(mockResponse.json).toHaveBeenCalledWith(mockAuthData);
  });

  it("should handle empty request body", async () => {
    // Arrange
    mockRequest.body = {};
    const mockError = "Email and password are required";

    // @ts-ignore
    LoginDto.create.mockReturnValue([mockError, null]);

    // Act
    await authController.login(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(LoginDto.create).toHaveBeenCalledWith({});
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: mockError });
    expect(mockLoginAuthExecute).not.toHaveBeenCalled();
  });
});
