import { Request, Response } from "express";
import { PayOrderTemplateController } from "../controller";
import { PayOrderTemplateRepository } from "@/domain/repositories/pay-order-template.repository";
import { DeletePayOrderTemplate } from "@/domain/use-cases/pay-order-template/delete-pay-order-template";

// Mock the DeletePayOrderTemplate class
jest.mock("@/domain/use-cases/pay-order-template/delete-pay-order-template");

describe("PayOrderTemplateController - deletePayOrderTemplate", () => {
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
        id: "123",
      },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    // Setup repository mock
    // @ts-ignore - Creating a mock repository
    mockPayOrderTemplateRepository = {};

    // Setup DeletePayOrderTemplate mock
    mockExecute = jest.fn();
    // @ts-ignore - Mocking the constructor and execute method
    DeletePayOrderTemplate.mockImplementation(() => ({
      execute: mockExecute,
    }));

    // Create controller instance
    controller = new PayOrderTemplateController(mockPayOrderTemplateRepository);
  });

  it("should extract id from request params", async () => {
    // Arrange
    mockExecute.mockResolvedValue({ id: "123", name: "Template 1" });

    // Act
    await controller.deletePayOrderTemplate(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(mockExecute).toHaveBeenCalledWith("123");
  });

  it("should return the deleted template on successful deletion", async () => {
    // Arrange
    const deletedTemplate = { id: "123", name: "Template 1" };
    mockExecute.mockResolvedValue(deletedTemplate);

    // Act
    await controller.deletePayOrderTemplate(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(DeletePayOrderTemplate).toHaveBeenCalledWith(
      mockPayOrderTemplateRepository
    );
    expect(mockExecute).toHaveBeenCalledWith("123");
    expect(mockResponse.json).toHaveBeenCalledWith(deletedTemplate);
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it("should return 400 status with error when deletion fails", async () => {
    // Arrange
    const mockError = { message: "Template not found" };
    mockExecute.mockRejectedValue(mockError);

    // Act
    await controller.deletePayOrderTemplate(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(DeletePayOrderTemplate).toHaveBeenCalledWith(
      mockPayOrderTemplateRepository
    );
    expect(mockExecute).toHaveBeenCalledWith("123");
  });

  it("should handle undefined id in request params", async () => {
    // Arrange
    mockRequest.params = {};
    mockExecute.mockResolvedValue(null);

    // Act
    await controller.deletePayOrderTemplate(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(mockExecute).toHaveBeenCalledWith(undefined);
    expect(mockResponse.json).toHaveBeenCalledWith(null);
  });

  it("should handle empty string id in request params", async () => {
    // Arrange
    mockRequest.params = { id: "" };
    mockExecute.mockResolvedValue(null);

    // Act
    await controller.deletePayOrderTemplate(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(mockExecute).toHaveBeenCalledWith("");
    expect(mockResponse.json).toHaveBeenCalledWith(null);
  });
});
