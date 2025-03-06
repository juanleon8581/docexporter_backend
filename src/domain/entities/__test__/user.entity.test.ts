import { UserEntity } from "../user.entity";
import { BadRequestError } from "@/errors/bad-request-error";

describe("UserEntity", () => {
  const mockValidDate = new Date();
  const mockValidUserData = {
    id: "1",
    authId: "auth123",
    name: "John",
    lastname: "Doe",
    createdAt: mockValidDate,
    updatedAt: mockValidDate,
    deleted: false,
  };

  describe("constructor", () => {
    test("should create a UserEntity instance with valid data", () => {
      // Act
      const user = new UserEntity(
        mockValidUserData.id,
        mockValidUserData.authId,
        mockValidUserData.name,
        mockValidUserData.lastname,
        mockValidUserData.createdAt,
        mockValidUserData.updatedAt,
        mockValidUserData.deleted
      );

      // Assert
      expect(user).toBeInstanceOf(UserEntity);
      expect(user.id).toBe(mockValidUserData.id);
      expect(user.authId).toBe(mockValidUserData.authId);
      expect(user.name).toBe(mockValidUserData.name);
      expect(user.lastname).toBe(mockValidUserData.lastname);
      expect(user.createdAt).toBe(mockValidUserData.createdAt);
      expect(user.updatedAt).toBe(mockValidUserData.updatedAt);
      expect(user.deleted).toBe(mockValidUserData.deleted);
    });
  });

  describe("fromJson", () => {
    test("should create a UserEntity from valid JSON", () => {
      // Act
      const user = UserEntity.fromJson(mockValidUserData);

      // Assert
      expect(user).toBeInstanceOf(UserEntity);
      expect(user.id).toBe(mockValidUserData.id);
      expect(user.authId).toBe(mockValidUserData.authId);
      expect(user.name).toBe(mockValidUserData.name);
      expect(user.lastname).toBe(mockValidUserData.lastname);
    });

    test("should throw BadRequestError when required fields are missing", () => {
      // Act
      const invalidData = { ...mockValidUserData, id: undefined };

      // Assert
      expect(() => {
        UserEntity.fromJson(invalidData);
      }).toThrow(BadRequestError);
    });

    test("should throw BadRequestError when dates are invalid", () => {
      // Arrange
      const invalidDateData = {
        ...mockValidUserData,
        createdAt: "invalid-date",
      };

      // Act & Assert
      expect(() => {
        UserEntity.fromJson(invalidDateData);
      }).toThrow(BadRequestError);
    });

    test("should handle optional deletedAt field", () => {
      // Arrange
      const dataWithDeletedAt = {
        ...mockValidUserData,
        deletedAt: mockValidDate,
      };

      // Act
      const user = UserEntity.fromJson(dataWithDeletedAt);
      // Assert
      expect(user).toBeInstanceOf(UserEntity);
      expect(user.deletedAt).toEqual(mockValidDate);
    });
  });

  describe("isDeleted", () => {
    test("should return true when deleted is true", () => {
      // Arrange & Act
      const user = new UserEntity(
        mockValidUserData.id,
        mockValidUserData.authId,
        mockValidUserData.name,
        mockValidUserData.lastname,
        mockValidUserData.createdAt,
        mockValidUserData.updatedAt,
        true
      );

      // Assert
      expect(user.isDeleted).toBe(true);
    });

    test("should return false when deleted is false", () => {
      // Arrange & Act
      const user = new UserEntity(
        mockValidUserData.id,
        mockValidUserData.authId,
        mockValidUserData.name,
        mockValidUserData.lastname,
        mockValidUserData.createdAt,
        mockValidUserData.updatedAt,
        false
      );

      // Assert
      expect(user.isDeleted).toBe(false);
    });
  });
});
