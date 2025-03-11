import { PayOrderTemplateEntity } from "../pay-order-template.entity";
import { BadRequestError } from "@/errors/bad-request-error";

describe("PayOrderTemplateEntity", () => {
  describe("fromJson", () => {
    const validDate = new Date("2023-01-01");
    const validJson = {
      id: "1",
      nameEntry: "Test Entry",
      createdAt: validDate,
      updatedAt: validDate,
      nameFor: "John Doe",
      nitFor: "123456",
      dni: "789012",
      role: "Manager",
      bank: "Test Bank",
      accountNumber: "987654321",
      deletedAt: null,
      deleted: false,
    };

    it("should create a PayOrderTemplateEntity from valid JSON", () => {
      // Arrange & Act
      const result = PayOrderTemplateEntity.fromJson(validJson);

      // Assert
      expect(result).toBeInstanceOf(PayOrderTemplateEntity);
      expect(result.id).toBe("1");
      expect(result.nameEntry).toBe("Test Entry");
      expect(result.createdAt).toEqual(validDate);
      expect(result.updatedAt).toEqual(validDate);
      expect(result.nameFor).toBe("John Doe");
      expect(result.nitFor).toBe("123456");
      expect(result.dni).toBe("789012");
      expect(result.role).toBe("Manager");
      expect(result.bank).toBe("Test Bank");
      expect(result.accountNumber).toBe("987654321");
      expect(result.deletedAt).toBeUndefined();
      expect(result.deleted).toBe(false);
    });

    it("should throw BadRequestError when id is missing", () => {
      // Arrange
      const invalidJson = { ...validJson, id: undefined };

      // Assert & Act
      expect(() => PayOrderTemplateEntity.fromJson(invalidJson)).toThrow(
        new BadRequestError("Invalid JSON data")
      );
    });

    it("should throw BadRequestError when nameEntry is missing", () => {
      // Arrange
      const invalidJson = { ...validJson, nameEntry: undefined };

      // Act & Assert
      expect(() => PayOrderTemplateEntity.fromJson(invalidJson)).toThrow(
        new BadRequestError("Invalid JSON data")
      );
    });

    it("should throw BadRequestError when createdAt is invalid", () => {
      // Arrange
      const invalidJson = { ...validJson, createdAt: "invalid-date" };

      // Act & Assert
      expect(() => PayOrderTemplateEntity.fromJson(invalidJson)).toThrow(
        new BadRequestError("Invalid date")
      );
    });

    it("should throw BadRequestError when updatedAt is invalid", () => {
      // Arrange
      const invalidJson = { ...validJson, updatedAt: "invalid-date" };

      // Act & Assert
      expect(() => PayOrderTemplateEntity.fromJson(invalidJson)).toThrow(
        new BadRequestError("Invalid date")
      );
    });

    it("should throw BadRequestError when deletedAt is invalid", () => {
      // Arrange
      const invalidJson = { ...validJson, deletedAt: "invalid-date" };

      // Act & Assert
      expect(() => PayOrderTemplateEntity.fromJson(invalidJson)).toThrow(
        new BadRequestError("Invalid date")
      );
    });

    it("should handle missing optional fields", () => {
      // Arrange
      const minimalJson = {
        id: "1",
        nameEntry: "Test Entry",
        createdAt: validDate,
        updatedAt: validDate,
      };

      // Act
      const result = PayOrderTemplateEntity.fromJson(minimalJson);

      // Assert
      expect(result).toBeInstanceOf(PayOrderTemplateEntity);
      expect(result.id).toBe("1");
      expect(result.nameEntry).toBe("Test Entry");
      expect(result.nameFor).toBeUndefined();
      expect(result.nitFor).toBeUndefined();
      expect(result.dni).toBeUndefined();
      expect(result.role).toBeUndefined();
      expect(result.bank).toBeUndefined();
      expect(result.accountNumber).toBeUndefined();
      expect(result.deletedAt).toBeUndefined();
      expect(result.deleted).toBe(false);
    });

    it("should handle valid deletedAt date", () => {
      // Arrange
      const deletedJson = {
        ...validJson,
        deletedAt: validDate,
        deleted: true,
      };

      // Act
      const result = PayOrderTemplateEntity.fromJson(deletedJson);

      // Assert
      expect(result).toBeInstanceOf(PayOrderTemplateEntity);
      expect(result.deletedAt).toEqual(validDate);
      expect(result.deleted).toBe(true);
    });

    it("should isDeleted return true when deleted", () => {
      // Arrange
      const deletedJson = {
        ...validJson,
        deletedAt: validDate,
        deleted: true,
      };

      // Act
      const result = PayOrderTemplateEntity.fromJson(deletedJson);

      // Assert
      expect(result.isDeleted).toBe(true);
    });

    it("should isDeleted return false when no deleted", () => {
      // Arrange
      const deletedJson = {
        ...validJson,
        deletedAt: undefined,
        deleted: false,
      };

      // Act
      const result = PayOrderTemplateEntity.fromJson(deletedJson);

      // Assert
      expect(result.isDeleted).toBe(false);
    });
  });
});
