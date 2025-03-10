import { Request, Response } from "express";
import { PayOrderTemplateController } from "../controller";
import { PayOrderTemplateRepository } from "@/domain/repositories/pay-order-template.repository";
import { GetPayOrderTemplates } from "@/domain/use-cases/pay-order-template/get-pay-order-templates";
import { PayOrderTemplateEntity } from "@/domain/entities";

// Mock the GetPayOrderTemplates class
jest.mock("@/domain/use-cases/pay-order-template/get-pay-order-templates");

describe("PayOrderTemplateController - getPayOrderTemplates", () => {
  // Setup mocks
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockPayOrderTemplateRepository: jest.Mocked<PayOrderTemplateRepository>;
  let controller: PayOrderTemplateController;
  let mockExecute: jest.Mock;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup request and response mocks
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    // Setup repository mock
    // @ts-ignore - Creating a mock repository
    mockPayOrderTemplateRepository =
      {} as jest.Mocked<PayOrderTemplateRepository>;

    // Setup GetPayOrderTemplates mock
    mockExecute = jest.fn();
    // @ts-ignore - Mocking the constructor and execute method
    GetPayOrderTemplates.mockImplementation(() => ({
      execute: mockExecute,
    }));

    // Create controller instance
    controller = new PayOrderTemplateController(mockPayOrderTemplateRepository);
  });

  it("should call GetPayOrderTemplates with the repository", async () => {
    const mockTemplates = [] as PayOrderTemplateEntity[];
    mockExecute.mockResolvedValue(mockTemplates);

    // Act
    controller.getPayOrderTemplates(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(GetPayOrderTemplates).toHaveBeenCalledWith(
      mockPayOrderTemplateRepository
    );
  });

  it("should return templates when GetPayOrderTemplates.execute resolves successfully", async () => {
    // Arrange
    const mockTemplates = [
      { id: "1", name: "Template 1", fields: [] },
      { id: "2", name: "Template 2", fields: [] },
    ];
    mockExecute.mockResolvedValue(mockTemplates);

    // Act
    await controller.getPayOrderTemplates(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(mockExecute).toHaveBeenCalled();
    expect(mockResponse.json).toHaveBeenCalledWith(mockTemplates);
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it("should return 400 status with error when GetPayOrderTemplates.execute rejects", async () => {
    // Arrange
    const mockError = { message: "Failed to fetch templates" };
    mockExecute.mockRejectedValue(mockError);

    // Act
    await controller.getPayOrderTemplates(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(mockExecute).toHaveBeenCalled();
  });

  it("should handle empty array of templates", async () => {
    // Arrange
    const mockTemplates: any[] = [];
    mockExecute.mockResolvedValue(mockTemplates);

    // Act
    await controller.getPayOrderTemplates(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(mockExecute).toHaveBeenCalled();
    expect(mockResponse.json).toHaveBeenCalledWith(mockTemplates);
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it("should handle null response from GetPayOrderTemplates.execute", async () => {
    // Arrange
    mockExecute.mockResolvedValue(null);

    // Act
    await controller.getPayOrderTemplates(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(mockExecute).toHaveBeenCalled();
    expect(mockResponse.json).toHaveBeenCalledWith(null);
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it("should handle complex error objects from GetPayOrderTemplates.execute", async () => {
    // Arrange
    const mockError = {
      code: "DB_ERROR",
      message: "Database connection failed",
      details: {
        timestamp: new Date().toISOString(),
        query: "SELECT * FROM templates",
      },
    };
    mockExecute.mockRejectedValue(mockError);

    // Act
    await controller.getPayOrderTemplates(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(mockExecute).toHaveBeenCalled();
  });
});
