import { UserController } from "../controller";
import { UserRepository } from "@/domain/repositories";
import { RegisterDto } from "@/domain/dtos/auth/register.dto";
import { UpdateUserDto } from "@/domain/dtos";
import {
  CreateUser,
  DeleteUser,
  GetUser,
  GetUsers,
  UpdateUser,
} from "@/domain/use-cases";
import { AuthRepository } from "@/domain/repositories/auth.repository";
import { AuthRepositoryImpl } from "@/infrastructure/repositories/auth.repository.impl";
import { Request, Response } from "express";
import { AuthDatasource } from "@/domain/datasources/auth.datasource";
import { UserDataSource } from "@/domain/datasources";
import { UserRepositoryImpl } from "@/infrastructure/repositories/user.repository.impl";

// Mock the repositories
jest.mock("@/domain/repositories/auth.repository");
jest.mock("@/domain/repositories");

// Mock the use cases
jest.mock("@/domain/use-cases", () => ({
  CreateUser: jest.fn().mockImplementation(() => ({
    execute: jest.fn().mockResolvedValue({ id: "1", name: "Test User" }),
  })),
  DeleteUser: jest.fn().mockImplementation(() => ({
    execute: jest.fn().mockResolvedValue(true),
  })),
  GetUser: jest.fn().mockImplementation(() => ({
    execute: jest.fn().mockResolvedValue({ id: "1", name: "Test User" }),
  })),
  GetUsers: jest.fn().mockImplementation(() => ({
    execute: jest.fn().mockResolvedValue([{ id: "1", name: "Test User" }]),
  })),
  UpdateUser: jest.fn().mockImplementation(() => ({
    execute: jest.fn().mockResolvedValue({ id: "1", name: "Updated User" }),
  })),
}));

// Mock the DTOs
jest.mock("@/domain/dtos/auth/register.dto");
jest.mock("@/domain/dtos");

describe("UserController", () => {
  let userController: UserController;
  let mockAuthRepository: jest.Mocked<AuthRepository>;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockAuthDatasource: AuthDatasource;
  let mockUserDatasource: UserDataSource;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    mockAuthDatasource = {
      register: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
    };

    mockUserDatasource = {
      create: jest.fn(),
      getById: jest.fn(),
      getAll: jest.fn(),
      update: jest.fn(),
      deleteById: jest.fn(),
    };

    // Create mock repositories
    mockAuthRepository = new AuthRepositoryImpl(
      mockAuthDatasource
    ) as unknown as jest.Mocked<AuthRepository>;
    mockUserRepository = new UserRepositoryImpl(
      mockUserDatasource
    ) as unknown as jest.Mocked<UserRepository>;

    // Create controller with mocked repositories
    userController = new UserController(mockAuthRepository, mockUserRepository);

    // Mock request and response objects
    mockRequest = {
      body: {},
      params: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe("constructor", () => {
    it("should initialize with the provided repositories", () => {
      // Assert that the controller was created with the correct repositories
      expect(userController).toBeInstanceOf(UserController);
      // @ts-ignore - Accessing private properties for testing
      expect(userController["authRepository"]).toBe(mockAuthRepository);
      // @ts-ignore - Accessing private properties for testing
      expect(userController["userRepository"]).toBe(mockUserRepository);
    });
  });

  describe("createUser", () => {
    it("should create a user successfully", async () => {
      // Arrange
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };
      mockRequest.body = userData;

      // Mock RegisterDto.create to return valid DTO
      (RegisterDto.create as jest.Mock).mockReturnValue([null, userData]);

      // Act
      await userController.createUser(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(RegisterDto.create).toHaveBeenCalledWith(userData);
      expect(CreateUser).toHaveBeenCalledWith(
        mockAuthRepository,
        mockUserRepository
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        id: "1",
        name: "Test User",
      });
    });

    it("should return 400 when RegisterDto validation fails", async () => {
      // Arrange
      const userData = {
        /* invalid data */
      };
      mockRequest.body = userData;

      // Mock RegisterDto.create to return error
      const validationError = { message: "Validation failed" };
      (RegisterDto.create as jest.Mock).mockReturnValue([
        validationError,
        null,
      ]);

      // Act
      await userController.createUser(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(RegisterDto.create).toHaveBeenCalledWith(userData);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: validationError,
      });
    });
  });

  describe("getUsers", () => {
    it("should get all users successfully", async () => {
      // Act
      await userController.getUsers(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(GetUsers).toHaveBeenCalledWith(mockUserRepository);
      expect(mockResponse.json).toHaveBeenCalledWith([
        { id: "1", name: "Test User" },
      ]);
    });
  });

  describe("getUserById", () => {
    it("should get a user by ID successfully", async () => {
      // Arrange
      mockRequest.params = { id: "1" };

      // Act
      await userController.getUserById(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(GetUser).toHaveBeenCalledWith(mockUserRepository);
      expect(mockResponse.json).toHaveBeenCalledWith({
        id: "1",
        name: "Test User",
      });
    });
  });

  describe("updateUser", () => {
    it("should update a user successfully", async () => {
      // Arrange
      const updateData = { id: "1", name: "Updated User" };
      mockRequest.body = updateData;

      // Mock UpdateUserDto.create to return valid DTO
      (UpdateUserDto.create as jest.Mock).mockReturnValue([null, updateData]);

      // Act
      await userController.updateUser(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(UpdateUserDto.create).toHaveBeenCalledWith(updateData);
      expect(UpdateUser).toHaveBeenCalledWith(mockUserRepository);
      expect(mockResponse.json).toHaveBeenCalledWith({
        id: "1",
        name: "Updated User",
      });
    });

    it("should return 400 when UpdateUserDto validation fails", async () => {
      // Arrange
      const updateData = {
        /* invalid data */
      };
      mockRequest.body = updateData;

      // Mock UpdateUserDto.create to return error
      const validationError = { message: "Validation failed" };
      (UpdateUserDto.create as jest.Mock).mockReturnValue([
        validationError,
        null,
      ]);

      // Act
      await userController.updateUser(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(UpdateUserDto.create).toHaveBeenCalledWith(updateData);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(validationError);
    });
  });

  describe("deleteUser", () => {
    it("should delete a user successfully", async () => {
      // Arrange
      mockRequest.params = { id: "1" };

      // Act
      await userController.deleteUser(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(DeleteUser).toHaveBeenCalledWith(mockUserRepository);
      expect(mockResponse.json).toHaveBeenCalledWith(true);
    });
  });
});
