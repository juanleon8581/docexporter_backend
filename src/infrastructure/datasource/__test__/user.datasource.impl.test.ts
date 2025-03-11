import { UserDatasourceImpl } from "../user.datasource.impl";
import { CreateUserDto, UpdateUserDto } from "@/domain/dtos";
import { UserEntity } from "@/domain/entities";
import { NotFoundError } from "@/errors/not-found-error";
import { prisma } from "@/data/postgres";

// Mock Prisma
jest.mock("@/data/postgres", () => ({
  prisma: {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe("UserDatasourceImpl", () => {
  let datasource: UserDatasourceImpl;

  beforeEach(() => {
    // Reset mocks and initialize datasource
    jest.clearAllMocks();
    datasource = new UserDatasourceImpl();
  });

  // Helper function to create mock User data
  const mockUserJson = {
    id: "user123",
    authId: "auth123",
    name: "John",
    lastname: "Doe",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-02"),
    deleted: false,
    deletedAt: null,
  };

  // === Create Tests ===
  describe("create", () => {
    const createDto: CreateUserDto = {
      authId: "auth123",
      name: "John",
      lastname: "Doe",
    };

    it("should successfully create a user", async () => {
      // Arrange
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUserJson);

      // Act
      const result = await datasource.create(createDto);

      // Assert
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: createDto,
      });
      expect(result).toBeInstanceOf(UserEntity);
      expect(result.id).toBe("user123");
      expect(result.authId).toBe("auth123");
      expect(result.name).toBe("John");
      expect(result.lastname).toBe("Doe");
    });

    it("should throw error if Prisma create fails", async () => {
      // Arrange
      (prisma.user.create as jest.Mock).mockRejectedValue(
        new Error("DB error")
      );

      // Act & Assert
      await expect(datasource.create(createDto)).rejects.toThrow("DB error");
      expect(prisma.user.create).toHaveBeenCalledTimes(1);
    });

    it("should handle special characters in name and lastname", async () => {
      // Arrange
      const specialDto: CreateUserDto = {
        authId: "auth123",
        name: "John 你好",
        lastname: "Doe こんにちは",
      };
      (prisma.user.create as jest.Mock).mockResolvedValue({
        ...mockUserJson,
        name: "John 你好",
        lastname: "Doe こんにちは",
      });

      // Act
      const result = await datasource.create(specialDto);

      // Assert
      expect(result.name).toBe("John 你好");
      expect(result.lastname).toBe("Doe こんにちは");
    });
  });

  // === GetAll Tests ===
  describe("getAll", () => {
    it("should retrieve all users", async () => {
      // Arrange
      (prisma.user.findMany as jest.Mock).mockResolvedValue([mockUserJson]);

      // Act
      const result = await datasource.getAll();

      // Assert
      expect(prisma.user.findMany).toHaveBeenCalledWith();
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(UserEntity);
      expect(result[0].id).toBe("user123");
      expect(result[0].name).toBe("John");
    });

    it("should return empty array if no users exist", async () => {
      // Arrange
      (prisma.user.findMany as jest.Mock).mockResolvedValue([]);

      // Act
      const result = await datasource.getAll();

      // Assert
      expect(result).toEqual([]);
    });
  });

  // === GetById Tests ===
  describe("getById", () => {
    it("should retrieve a user by ID", async () => {
      // Arrange
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUserJson);

      // Act
      const result = await datasource.getById("user123");

      // Assert
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "user123", deleted: false },
      });
      expect(result).toBeInstanceOf(UserEntity);
      expect(result.id).toBe("user123");
      expect(result.authId).toBe("auth123");
    });

    it("should throw NotFoundError if user is not found", async () => {
      // Arrange
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(datasource.getById("user123")).rejects.toThrow(
        new NotFoundError("user not found")
      );
      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  // === Update Tests ===
  describe("update", () => {
    const updateDto: UpdateUserDto = {
      id: "user123",
      name: "Jane",
      lastname: "Smith",
      values: {
        name: "Jane",
        lastname: "Smith",
      },
    };

    it("should successfully update a user", async () => {
      // Arrange
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUserJson);
      (prisma.user.update as jest.Mock).mockResolvedValue({
        ...mockUserJson,
        name: "Jane",
        lastname: "Smith",
      });

      // Act
      const result = await datasource.update(updateDto);

      // Assert
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "user123" },
        data: updateDto.values,
      });
      expect(result).toBeInstanceOf(UserEntity);
      expect(result.name).toBe("Jane");
      expect(result.lastname).toBe("Smith");
    });

    it("should update only provided fields", async () => {
      // Arrange
      const partialUpdateDto: UpdateUserDto = {
        id: "user123",
        name: "Jane",
        values: { name: "Jane" },
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUserJson);
      (prisma.user.update as jest.Mock).mockResolvedValue({
        ...mockUserJson,
        name: "Jane",
      });

      // Act
      const result = await datasource.update(partialUpdateDto);

      // Assert
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "user123" },
        data: { name: "Jane" },
      });
      expect(result.name).toBe("Jane");
      expect(result.lastname).toBe("Doe"); // Unchanged
    });

    it("should throw NotFoundError if user to update is not found", async () => {
      // Arrange
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(datasource.update(updateDto)).rejects.toThrow(
        new NotFoundError("user not found")
      );
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });

  // === DeleteById Tests ===
  describe("deleteById", () => {
    it("should soft-delete a user", async () => {
      // Arrange
      const deletedAt = new Date();
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUserJson);
      (prisma.user.update as jest.Mock).mockResolvedValue({
        ...mockUserJson,
        deleted: true,
        deletedAt,
      });

      // Act
      const result = await datasource.deleteById("user123");

      // Assert
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "user123" },
        data: { deleted: true, deletedAt: expect.any(Date) },
      });
      expect(result).toBeInstanceOf(UserEntity);
      expect(result.deleted).toBe(true);
      expect(result.deletedAt).toBeInstanceOf(Date);
    });

    it("should throw NotFoundError if user to delete is not found", async () => {
      // Arrange
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(datasource.deleteById("user123")).rejects.toThrow(
        new NotFoundError("user not found")
      );
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });
});
