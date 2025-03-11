import { Request, Response } from "express";
import { PayOrderTemplateController } from "../controller";
import { CreatePayOrderTemplateDto } from "@/domain/dtos";
import { PayOrderTemplateRepository } from "@/domain/repositories/pay-order-template.repository";
import { CreatePayOrder } from "@/domain/use-cases/pay-order-template/create-pay-order-template";

// Mock dependencies
jest.mock("@/domain/dtos", () => ({
  CreatePayOrderTemplateDto: {
    create: jest.fn(),
  },
}));

jest.mock("@/domain/use-cases/pay-order-template/create-pay-order-template");

describe("PayOrderTemplateController - createPayOrderTemplate", () => {
  // Setup mocks
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockRepository: jest.Mocked<PayOrderTemplateRepository>;
  let controller: PayOrderTemplateController;
  let mockExecute: jest.Mock;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup request and response mocks
    mockRequest = {
      body: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    // Setup repository mock
    // @ts-ignore
    mockRepository = {} as jest.Mocked<PayOrderTemplateRepository>;

    // Setup CreatePayOrder mock
    mockExecute = jest.fn();
    // @ts-ignore
    CreatePayOrder.prototype.execute = mockExecute;

    // Create controller instance
    controller = new PayOrderTemplateController(mockRepository);
  });

  it("should return 400 if CreatePayOrderTemplateDto.create returns an error", () => {
    // Arrange
    const validationError = "Validation error";
    // @ts-ignore
    CreatePayOrderTemplateDto.create.mockReturnValue([validationError, null]);

    // Act
    controller.createPayOrderTemplate(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(CreatePayOrderTemplateDto.create).toHaveBeenCalledWith(
      mockRequest.body
    );
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: validationError });
    expect(CreatePayOrder).not.toHaveBeenCalled();
    expect(mockExecute).not.toHaveBeenCalled();
  });

  it("should call CreatePayOrder.execute and return success response", async () => {
    // Arrange
    const mockDto = {
      name: "Test Template",
      description: "Test Description",
      fields: [{ name: "field1", type: "text" }],
    };
    const mockTemplate = {
      id: "123",
      name: "Test Template",
      description: "Test Description",
      fields: [{ name: "field1", type: "text" }],
      createdAt: new Date().toISOString(),
    };

    // @ts-ignore
    CreatePayOrderTemplateDto.create.mockReturnValue([null, mockDto]);
    mockExecute.mockResolvedValue(mockTemplate);

    // Act
    await controller.createPayOrderTemplate(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(CreatePayOrderTemplateDto.create).toHaveBeenCalledWith(
      mockRequest.body
    );
    expect(CreatePayOrder).toHaveBeenCalledWith(mockRepository);
    expect(mockExecute).toHaveBeenCalledWith(mockDto);
    expect(mockResponse.json).toHaveBeenCalledWith(mockTemplate);
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it("should return 400 if CreatePayOrder.execute throws an error", async () => {
    // Arrange
    const mockDto = {
      name: "Test Template",
      description: "Test Description",
      fields: [{ name: "field1", type: "text" }],
    };
    const mockError = { message: "Creation failed", code: "ERR_CREATION" };

    // @ts-ignore
    CreatePayOrderTemplateDto.create.mockReturnValue([null, mockDto]);
    mockExecute.mockRejectedValue(mockError);

    // Act
    await controller.createPayOrderTemplate(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(CreatePayOrderTemplateDto.create).toHaveBeenCalledWith(
      mockRequest.body
    );
    expect(CreatePayOrder).toHaveBeenCalledWith(mockRepository);
    expect(mockExecute).toHaveBeenCalledWith(mockDto);
  });

  it("should handle valid request body correctly", async () => {
    // Arrange
    const validRequestBody = {
      name: "Invoice Template",
      description: "Template for invoices",
      fields: [
        { name: "customerName", type: "text", required: true },
        { name: "amount", type: "number", required: true },
      ],
    };
    mockRequest.body = validRequestBody;

    const mockDto = { ...validRequestBody };
    const mockTemplate = {
      id: "123",
      ...validRequestBody,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // @ts-ignore
    CreatePayOrderTemplateDto.create.mockReturnValue([null, mockDto]);
    mockExecute.mockResolvedValue(mockTemplate);

    // Act
    await controller.createPayOrderTemplate(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(CreatePayOrderTemplateDto.create).toHaveBeenCalledWith(
      validRequestBody
    );
    expect(mockExecute).toHaveBeenCalledWith(mockDto);
    expect(mockResponse.json).toHaveBeenCalledWith(mockTemplate);
  });

  it("should handle empty request body", async () => {
    // Arrange
    mockRequest.body = {};
    const validationError = "Required fields are missing";

    // @ts-ignore
    CreatePayOrderTemplateDto.create.mockReturnValue([validationError, null]);

    // Act
    await controller.createPayOrderTemplate(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(CreatePayOrderTemplateDto.create).toHaveBeenCalledWith({});
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: validationError });
    expect(mockExecute).not.toHaveBeenCalled();
  });
});
