import { PayOrderTemplateDatasource } from "@/domain/datasources";
import { PayOrderTemplateRepositoryImpl } from "../pay-order-template.repository.impl";
import {
  CreatePayOrderTemplateDto,
  UpdatePayOrderTemplateDto,
} from "@/domain/dtos";
import { PayOrderTemplateEntity } from "@/domain/entities/pay-order-template.entity";

describe("PayOrderTemplateRepositoryImpl", () => {
  const validDate = new Date();
  const mockDatasource: jest.Mocked<PayOrderTemplateDatasource> = {
    create: jest.fn(),
    deleteById: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
  };
  const repository: PayOrderTemplateRepositoryImpl =
    new PayOrderTemplateRepositoryImpl(mockDatasource);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create an instance with the provided datasource", () => {
    // Assert
    expect(repository).toBeInstanceOf(PayOrderTemplateRepositoryImpl);
  });

  describe("create", () => {
    const createDto: CreatePayOrderTemplateDto = {
      nameEntry: "Test Template",
      userId: "123",
      nameFor: "John Doe",
      accountNumber: "1234567890",
      bank: "Banco Popular",
      dni: "12345678",
      nitFor: "1234567890",
      role: "ROLE",
    };

    it("should successfully create a pay order template", async () => {
      // Arrange
      const expectedResult: PayOrderTemplateEntity =
        PayOrderTemplateEntity.fromJson({
          ...createDto,
          id: "123",
          createdAt: validDate,
          updatedAt: validDate,
        });
      mockDatasource.create.mockResolvedValue(expectedResult);

      // Act
      const result = await repository.create(createDto);

      // Assert
      expect(result).toBe(expectedResult);
      expect(mockDatasource.create).toHaveBeenCalledWith(createDto);
      expect(mockDatasource.create).toHaveBeenCalledTimes(1);
      expect(result.id).toBe(expectedResult.id);
      expect(result.nameEntry).toBe(expectedResult.nameEntry);
    });

    it("should propagate error when datasource fails", async () => {
      expect(mockDatasource.create).toHaveBeenCalledTimes(0);
      // Arrange
      const expectedError = new Error("Database error");
      mockDatasource.create.mockRejectedValue(expectedError);

      // Act & Assert
      await expect(repository.create(createDto)).rejects.toThrow(expectedError);
      expect(mockDatasource.create).toHaveBeenCalledTimes(1);
      expect(mockDatasource.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe("update", () => {
    const updateDto: UpdatePayOrderTemplateDto = {
      id: "123",
      nameEntry: "Test Template",
      userId: "123",
    };

    it("should successfully update a pay order template", async () => {
      // Arrange
      const expectedResult: PayOrderTemplateEntity =
        PayOrderTemplateEntity.fromJson({
          ...updateDto,
          bank: "Test Bank",
          id: "123",
          createdAt: validDate,
          updatedAt: validDate,
        });

      mockDatasource.update.mockResolvedValue(expectedResult);

      // Act
      const result = await repository.update(updateDto);

      // Assert
      expect(result).toBe(expectedResult);
      expect(result).toBeInstanceOf(PayOrderTemplateEntity);
      expect(result.id).toBe(updateDto.id);
      expect(result.bank).toBe("Test Bank");
      expect(mockDatasource.update).toHaveBeenCalledWith(updateDto);
      expect(mockDatasource.update).toHaveBeenCalledTimes(1);
    });
  });
});
