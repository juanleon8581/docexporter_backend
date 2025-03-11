// src/presentation/users/controllers/__test__/controller.test.ts
import { Request, Response } from "express";
import { UserController } from "../controller";
import { UserRepository } from "@/domain/repositories";
import { AuthRepository } from "@/domain/repositories/auth.repository";
import { RegisterDto } from "@/domain/dtos/auth/register.dto";
import { UpdateUserDto } from "@/domain/dtos";
import {
  CreateUser,
  DeleteUser,
  GetUser,
  GetUsers,
  UpdateUser,
} from "@/domain/use-cases";
import { UserEntity } from "@/domain/entities";

// Mock dependencies
jest.mock("@/domain/dtos/auth/register.dto");
jest.mock("@/domain/dtos");
jest.mock("@/domain/use-cases");

describe("UserController", () => {
  let controller: UserController;
  let mockAuthRepository: jest.Mocked<AuthRepository>;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  // Mock use case implementations
  const mockCreateUser = { execute: jest.fn() };
  const mockGetUsers = { execute: jest.fn() };
  const mockGetUser = { execute: jest.fn() };
  const mockUpdateUser = { execute: jest.fn() };
  const mockDeleteUser = { execute: jest.fn() };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup mock repositories
    mockAuthRepository = {
      register: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
    } as jest.Mocked<AuthRepository>;

    mockUserRepository = {
      create: jest.fn(),
      update: jest.fn(),
      getAll: jest.fn(),
      getById: jest.fn(),
      deleteById: jest.fn(),
    } as jest.Mocked<UserRepository>;

    // Setup mock request and response
    mockRequest = {
      body: {},
      params: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    // Setup mock use cases
    (CreateUser as jest.Mock).mockImplementation(() => mockCreateUser);
    (GetUsers as jest.Mock).mockImplementation(() => mockGetUsers);
    (GetUser as jest.Mock).mockImplementation(() => mockGetUser);
    (UpdateUser as jest.Mock).mockImplementation(() => mockUpdateUser);
    (DeleteUser as jest.Mock).mockImplementation(() => mockDeleteUser);

    // Initialize controller
    controller = new UserController(mockAuthRepository, mockUserRepository);
  });

  describe("constructor", () => {
    it("should initialize with provided repositories", () => {
      expect(controller).toBeInstanceOf(UserController);
      // @ts-ignore - Accessing private properties for testing
      expect(controller["authRepository"]).toBe(mockAuthRepository);
      // @ts-ignore - Accessing private properties for testing
      expect(controller["userRepository"]).toBe(mockUserRepository);
    });
  });

  describe("createUser", () => {
    const validRegisterData = {
      name: "John",
      lastname: "Doe",
      email: "john@example.com",
      password: "password123",
    };

    it("should create user successfully with valid DTO", async () => {
      // Arrange
      mockRequest.body = validRegisterData;
      const mockUser = { id: "1", ...validRegisterData };
      (RegisterDto.create as jest.Mock).mockReturnValue([
        null,
        validRegisterData,
      ]);
      mockCreateUser.execute.mockResolvedValue(mockUser);

      // Act
      await controller.createUser(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(RegisterDto.create).toHaveBeenCalledWith(validRegisterData);
      expect(CreateUser).toHaveBeenCalledWith(
        mockAuthRepository,
        mockUserRepository
      );
      expect(mockCreateUser.execute).toHaveBeenCalledWith(validRegisterData);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it("should return 400 when RegisterDto validation fails", async () => {
      // Arrange
      mockRequest.body = { email: "invalid" };
      const error = "Invalid Data";
      (RegisterDto.create as jest.Mock).mockReturnValue([error, undefined]);

      // Act
      await controller.createUser(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(RegisterDto.create).toHaveBeenCalledWith({ email: "invalid" });
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error });
      expect(mockCreateUser.execute).not.toHaveBeenCalled();
    });

    it("should handle create user error", async () => {
      // Arrange
      mockRequest.body = validRegisterData;
      (RegisterDto.create as jest.Mock).mockReturnValue([
        null,
        validRegisterData,
      ]);
      const error = new Error("Creation failed");
      mockCreateUser.execute.mockRejectedValue(error);

      // Act
      await controller.createUser(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockCreateUser.execute).toHaveBeenCalled();
    });
  });

  describe("getUsers", () => {
    it("should return all users successfully", async () => {
      // Arrange
      const mockUsers = [
        { id: "1", name: "John", lastname: "Doe" },
        { id: "2", name: "Jane", lastname: "Doe" },
      ];
      mockGetUsers.execute.mockResolvedValue(mockUsers);

      // Act
      await controller.getUsers(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(GetUsers).toHaveBeenCalledWith(mockUserRepository);
      expect(mockGetUsers.execute).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockUsers);
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it("should handle get users error", async () => {
      // Arrange
      const error = new Error("Fetch failed");
      mockGetUsers.execute.mockRejectedValue(error);

      // Act
      await controller.getUsers(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockGetUsers.execute).toHaveBeenCalled();
    });
  });

  describe("getUserById", () => {
    it("should return user by ID successfully", async () => {
      // Arrange
      mockRequest.params = { id: "1" };
      const mockUser = { id: "1", name: "John", lastname: "Doe" };
      mockGetUser.execute.mockResolvedValue(mockUser);

      // Act
      await controller.getUserById(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(GetUser).toHaveBeenCalledWith(mockUserRepository);
      expect(mockGetUser.execute).toHaveBeenCalledWith("1");
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it("should handle get user by ID error", async () => {
      // Arrange
      mockRequest.params = { id: "1" };
      const error = new Error("User not found");
      mockGetUser.execute.mockRejectedValue(error);

      // Act
      await controller.getUserById(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockGetUser.execute).toHaveBeenCalledWith("1");
    });
  });

  describe("updateUser", () => {
    const validUpdateData = { id: "1", name: "Updated John" };

    it("should update user successfully with valid DTO", async () => {
      // Arrange
      mockRequest.body = validUpdateData;
      const mockUpdatedUser = {
        id: "1",
        name: "Updated John",
        lastname: "Doe",
      };
      (UpdateUserDto.create as jest.Mock).mockReturnValue([
        null,
        validUpdateData,
      ]);
      mockUpdateUser.execute.mockResolvedValue(mockUpdatedUser);

      // Act
      await controller.updateUser(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(UpdateUserDto.create).toHaveBeenCalledWith(validUpdateData);
      expect(UpdateUser).toHaveBeenCalledWith(mockUserRepository);
      expect(mockUpdateUser.execute).toHaveBeenCalledWith(validUpdateData);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedUser);
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it("should return 400 when UpdateUserDto validation fails", async () => {
      // Arrange
      mockRequest.body = { name: "No ID" };
      const error = "Invalid Data";
      (UpdateUserDto.create as jest.Mock).mockReturnValue([error, undefined]);

      // Act
      await controller.updateUser(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(UpdateUserDto.create).toHaveBeenCalledWith({ name: "No ID" });
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(error);
      expect(mockUpdateUser.execute).not.toHaveBeenCalled();
    });

    it("should handle update user error", async () => {
      // Arrange
      mockRequest.body = validUpdateData;
      (UpdateUserDto.create as jest.Mock).mockReturnValue([
        null,
        validUpdateData,
      ]);
      const error = new Error("Update failed");
      mockUpdateUser.execute.mockRejectedValue(error);

      // Act
      await controller.updateUser(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockUpdateUser.execute).toHaveBeenCalled();
    });
  });

  describe("deleteUser", () => {
    it("should delete user successfully", async () => {
      // Arrange
      mockRequest.params = { id: "1" };
      const mockDeletedUser = { id: "1", name: "John", lastname: "Doe" };
      mockDeleteUser.execute.mockResolvedValue(mockDeletedUser);

      // Act
      await controller.deleteUser(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(DeleteUser).toHaveBeenCalledWith(mockUserRepository);
      expect(mockDeleteUser.execute).toHaveBeenCalledWith("1");
      expect(mockResponse.json).toHaveBeenCalledWith(mockDeletedUser);
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it("should handle delete user error", async () => {
      // Arrange
      mockRequest.params = { id: "1" };
      const error = new Error("Delete failed");
      mockDeleteUser.execute.mockRejectedValue(error);

      // Act
      await controller.deleteUser(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockDeleteUser.execute).toHaveBeenCalledWith("1");
    });
  });
});
