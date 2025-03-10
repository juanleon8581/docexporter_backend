import { PayOrderTemplateDatasourceImpl } from "../pay-order-template.datasource.impl";
import {
  CreatePayOrderTemplateDto,
  UpdatePayOrderTemplateDto,
} from "@/domain/dtos";
import { PayOrderTemplateEntity } from "@/domain/entities";
import { NotFoundError } from "@/errors/not-found-error";
import { prisma } from "@/data/postgres";
import { CryptoAdapter } from "@/config/adapters/crypto.adapter";

// Mock Prisma and CryptoAdapter
jest.mock("@/data/postgres", () => ({
  prisma: {
    payOrderTemplate: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("@/config/adapters/crypto.adapter", () => ({
  CryptoAdapter: {
    encrypt: jest.fn((text) => `encrypted_${text}`),
    decrypt: jest.fn((encrypted) => encrypted.replace("encrypted_", "")),
  },
}));

describe("PayOrderTemplateDatasourceImpl", () => {
  let datasource: PayOrderTemplateDatasourceImpl;

  beforeEach(() => {
    // Reset mocks and initialize datasource
    jest.clearAllMocks();
    datasource = new PayOrderTemplateDatasourceImpl();
  });

  // Helper function to create mock PayOrderTemplate data
  const mockTemplateJson = {
    id: "template123",
    userId: "user123",
    nameEntry: "Test Template",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-02"),
    nameFor: "John Doe",
    nitFor: "123456789",
    dni: "encrypted_12345678",
    role: "Manager",
    bank: "encrypted_Bank XYZ",
    accountNumber: "encrypted_987654321",
    deleted: false,
    deletedAt: null,
  };

  const decryptedTemplateJson = {
    ...mockTemplateJson,
    dni: "12345678",
    bank: "Bank XYZ",
    accountNumber: "987654321",
  };

  // === Create Tests ===
  describe("create", () => {
    const createDto: CreatePayOrderTemplateDto = {
      userId: "user123",
      nameEntry: "Test Template",
      nameFor: "John Doe",
      nitFor: "123456789",
      dni: "12345678",
      role: "Manager",
      bank: "Bank XYZ",
      accountNumber: "987654321",
    };

    it("should successfully create a pay order template with encrypted data", async () => {
      // Arrange
      (prisma.payOrderTemplate.create as jest.Mock).mockResolvedValue(
        mockTemplateJson
      );

      // Act
      const result = await datasource.create(createDto);

      // Assert
      expect(prisma.payOrderTemplate.create).toHaveBeenCalledWith({
        data: {
          ...createDto,
          dni: "encrypted_12345678",
          bank: "encrypted_Bank XYZ",
          accountNumber: "encrypted_987654321",
        },
      });
      expect(CryptoAdapter.encrypt).toHaveBeenCalledTimes(3);
      expect(result).toBeInstanceOf(PayOrderTemplateEntity);
      expect(result.id).toBe("template123");
      expect(result.dni).toBe("12345678");
      expect(result.bank).toBe("Bank XYZ");
      expect(result.accountNumber).toBe("987654321");
    });

    it("should create a template without optional sensitive fields", async () => {
      // Arrange
      const minimalDto: CreatePayOrderTemplateDto = {
        userId: "user123",
        nameEntry: "Minimal Template",
      };
      (prisma.payOrderTemplate.create as jest.Mock).mockResolvedValue({
        ...mockTemplateJson,
        nameEntry: "Minimal Template",
        dni: undefined,
        bank: undefined,
        accountNumber: undefined,
      });

      // Act
      const result = await datasource.create(minimalDto);

      // Assert
      expect(CryptoAdapter.encrypt).not.toHaveBeenCalled();
      expect(result.dni).toBeUndefined();
      expect(result.bank).toBeUndefined();
      expect(result.accountNumber).toBeUndefined();
    });

    it("should throw error if Prisma create fails", async () => {
      // Arrange
      (prisma.payOrderTemplate.create as jest.Mock).mockRejectedValue(
        new Error("DB error")
      );

      // Act & Assert
      await expect(datasource.create(createDto)).rejects.toThrow("DB error");
      expect(prisma.payOrderTemplate.create).toHaveBeenCalledTimes(1);
    });
  });

  // === GetAll Tests ===
  describe("getAll", () => {
    it("should retrieve all pay order templates with decrypted data", async () => {
      // Arrange
      (prisma.payOrderTemplate.findMany as jest.Mock).mockResolvedValue([
        mockTemplateJson,
      ]);

      // Act
      const result = await datasource.getAll();

      // Assert
      expect(prisma.payOrderTemplate.findMany).toHaveBeenCalledWith();
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(PayOrderTemplateEntity);
      expect(result[0].dni).toBe(decryptedTemplateJson.dni);
      expect(result[0].bank).toBe(decryptedTemplateJson.bank);
      expect(CryptoAdapter.decrypt).toHaveBeenCalledTimes(3);
    });

    it("should return empty array if no templates exist", async () => {
      // Arrange
      (prisma.payOrderTemplate.findMany as jest.Mock).mockResolvedValue([]);

      // Act
      const result = await datasource.getAll();

      // Assert
      expect(result).toEqual([]);
      expect(CryptoAdapter.decrypt).not.toHaveBeenCalled();
    });
  });

  // === GetById Tests ===
  describe("getById", () => {
    it("should retrieve a pay order template by ID with decrypted data", async () => {
      // Arrange
      (prisma.payOrderTemplate.findUnique as jest.Mock).mockResolvedValue(
        mockTemplateJson
      );

      // Act
      const result = await datasource.getById("template123");

      // Assert
      expect(prisma.payOrderTemplate.findUnique).toHaveBeenCalledWith({
        where: { id: "template123", deleted: false },
      });
      expect(result).toBeInstanceOf(PayOrderTemplateEntity);
      expect(result.id).toBe("template123");
      expect(result.dni).toBe(decryptedTemplateJson.dni);
      expect(CryptoAdapter.decrypt).toHaveBeenCalledTimes(3);
    });

    it("should throw NotFoundError if template is not found", async () => {
      // Arrange
      (prisma.payOrderTemplate.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(datasource.getById("template123")).rejects.toThrow(
        new NotFoundError("Template no found")
      );
      expect(prisma.payOrderTemplate.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  // === Update Tests ===
  describe("update", () => {
    const updateDto: UpdatePayOrderTemplateDto = {
      id: "template123",
      userId: "user123",
      nameEntry: "Updated Template",
      nameFor: "Jane Doe",
      dni: "87654321",
      bank: "New Bank",
      accountNumber: "123456789",
    };

    it("should successfully update a pay order template with encrypted data", async () => {
      // Arrange
      (prisma.payOrderTemplate.findUnique as jest.Mock).mockResolvedValue(
        mockTemplateJson
      );
      (prisma.payOrderTemplate.update as jest.Mock).mockResolvedValue({
        ...mockTemplateJson,
        nameEntry: "Updated Template",
        nameFor: "Jane Doe",
        dni: "encrypted_87654321",
        bank: "encrypted_New Bank",
        accountNumber: "encrypted_123456789",
      });

      // Act
      const result = await datasource.update(updateDto);

      // Assert
      expect(prisma.payOrderTemplate.update).toHaveBeenCalledWith({
        where: { id: "template123" },
        data: {
          ...updateDto,
          dni: "encrypted_87654321",
          bank: "encrypted_New Bank",
          accountNumber: "encrypted_123456789",
        },
      });
      expect(result.nameEntry).toBe("Updated Template");
      expect(result.dni).toBe("87654321");
      expect(CryptoAdapter.encrypt).toHaveBeenCalledTimes(3);
    });

    it("should throw NotFoundError if template to update is not found", async () => {
      // Arrange
      (prisma.payOrderTemplate.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(datasource.update(updateDto)).rejects.toThrow(
        new NotFoundError("Template no found")
      );
      expect(prisma.payOrderTemplate.update).not.toHaveBeenCalled();
    });
  });

  // === DeleteById Tests ===
  describe("deleteById", () => {
    it("should soft-delete a pay order template", async () => {
      // Arrange
      const deletedAt = new Date();
      (prisma.payOrderTemplate.findUnique as jest.Mock).mockResolvedValue(
        mockTemplateJson
      );
      (prisma.payOrderTemplate.update as jest.Mock).mockResolvedValue({
        ...mockTemplateJson,
        deleted: true,
        deletedAt,
      });

      // Act
      const result = await datasource.deleteById("template123");

      // Assert
      expect(prisma.payOrderTemplate.update).toHaveBeenCalledWith({
        where: { id: "template123" },
        data: { deleted: true, deletedAt: expect.any(Date) },
      });
      expect(result.deleted).toBe(true);
      expect(result.deletedAt).toBeInstanceOf(Date);
      expect(result.dni).toBe("12345678");
    });

    it("should throw NotFoundError if template to delete is not found", async () => {
      // Arrange
      (prisma.payOrderTemplate.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(datasource.deleteById("template123")).rejects.toThrow(
        new NotFoundError("Template no found")
      );
      expect(prisma.payOrderTemplate.update).not.toHaveBeenCalled();
    });
  });
});
