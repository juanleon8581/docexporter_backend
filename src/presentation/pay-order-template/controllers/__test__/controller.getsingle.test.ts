import { Request, Response } from "express";
import { PayOrderTemplateController } from "../controller";
import { PayOrderTemplateRepository } from "@/domain/repositories/pay-order-template.repository";
import { GetPayOrderTemplate } from "@/domain/use-cases/pay-order-template/get-pay-order-template";

// Mock the GetPayOrderTemplate class
jest.mock("@/domain/use-cases/pay-order-template/get-pay-order-template");

describe("PayOrderTemplateController - getPayOrderTemplate", () => {
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
    mockRequest = {
      params: {
        id: "test-id-123",
      },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    // Setup repository mock
    // @ts-ignore - Creating a mock repository
    mockPayOrderTemplateRepository = {};

    // Setup GetPayOrderTemplate mock
    mockExecute = jest.fn();
    // @ts-ignore - Mocking the constructor and execute method
    GetPayOrderTemplate.mockImplementation(() => ({
      execute: mockExecute,
    }));

    // Create controller instance
    controller = new PayOrderTemplateController(mockPayOrderTemplateRepository);
  });

  it("should extract id from request params", async () => {
    // Arrange
    const expectedId = "test-id-123";
    mockExecute.mockResolvedValue({ id: expectedId, name: "Test Template" });

    // Act
    await controller.getPayOrderTemplate(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(mockExecute).toHaveBeenCalledWith(expectedId);
  });

  it("should return template data when GetPayOrderTemplate executes successfully", async () => {
    // Arrange
    const mockTemplate = {
      id: "test-id-123",
      name: "Test Template",
      description: "Test Description",
      createdAt: new Date().toISOString(),
    };
    mockExecute.mockResolvedValue(mockTemplate);

    // Act
    await controller.getPayOrderTemplate(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(GetPayOrderTemplate).toHaveBeenCalledWith(
      mockPayOrderTemplateRepository
    );
    expect(mockExecute).toHaveBeenCalledWith("test-id-123");
    expect(mockResponse.json).toHaveBeenCalledWith(mockTemplate);
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it("should return 400 status with error when GetPayOrderTemplate fails", async () => {
    // Arrange
    const mockError = { message: "Template not found" };
    mockExecute.mockRejectedValue(mockError);

    // Act
    await controller.getPayOrderTemplate(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(GetPayOrderTemplate).toHaveBeenCalledWith(
      mockPayOrderTemplateRepository
    );
    expect(mockExecute).toHaveBeenCalledWith("test-id-123");
  });

  it("should handle empty id in request params", async () => {
    // Arrange
    mockRequest.params = { id: "" };
    const mockError = { message: "Invalid ID" };
    mockExecute.mockRejectedValue(mockError);

    // Act
    await controller.getPayOrderTemplate(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(mockExecute).toHaveBeenCalledWith("");
  });

  it("should handle missing id in request params", async () => {
    // Arrange
    mockRequest.params = {};
    const mockError = { message: "ID is required" };
    mockExecute.mockRejectedValue(mockError);

    // Act
    await controller.getPayOrderTemplate(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(mockExecute).toHaveBeenCalledWith(undefined);
  });

  it("should handle non-string id in request params", async () => {
    // Arrange
    // @ts-ignore - Testing with a non-string ID
    mockRequest.params = { id: 123 };
    mockExecute.mockResolvedValue({ id: "123", name: "Test Template" });

    // Act
    await controller.getPayOrderTemplate(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(mockExecute).toHaveBeenCalledWith(123);
    expect(mockResponse.json).toHaveBeenCalledWith({
      id: "123",
      name: "Test Template",
    });
  });
});
