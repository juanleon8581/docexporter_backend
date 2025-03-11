import { Request, Response } from "express";
import { PayOrderTemplateController } from "../controller";
import { UpdatePayOrderTemplateDto } from "@/domain/dtos";
import { PayOrderTemplateRepository } from "@/domain/repositories/pay-order-template.repository";
import { UpdatePayOrderTemplate } from "@/domain/use-cases/pay-order-template/update-pay-order-template";

// Mock dependencies
jest.mock("@/domain/dtos", () => ({
  UpdatePayOrderTemplateDto: {
    create: jest.fn(),
  },
}));

jest.mock("@/domain/use-cases/pay-order-template/update-pay-order-template");

describe("PayOrderTemplateController - updatePayOrderTemplate", () => {
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
      body: {
        id: "123",
        name: "Updated Template",
        description: "Updated description",
        fields: [{ name: "field1", type: "text" }],
      },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    // Setup repository mock
    mockPayOrderTemplateRepository =
      {} as jest.Mocked<PayOrderTemplateRepository>;

    // Setup UpdatePayOrderTemplate mock
    mockExecute = jest.fn();
    // @ts-ignore
    UpdatePayOrderTemplate.mockImplementation(() => ({
      execute: mockExecute,
    }));

    // Create controller instance
    controller = new PayOrderTemplateController(mockPayOrderTemplateRepository);
  });

  it("should return 400 if UpdatePayOrderTemplateDto.create returns an error", () => {
    // Arrange
    const validationError = "Validation error";
    // @ts-ignore
    UpdatePayOrderTemplateDto.create.mockReturnValue([validationError, null]);

    // Act
    controller.updatePayOrderTemplate(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(UpdatePayOrderTemplateDto.create).toHaveBeenCalledWith(
      mockRequest.body
    );
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: validationError });
    expect(UpdatePayOrderTemplate).not.toHaveBeenCalled();
  });

  it("should call UpdatePayOrderTemplate.execute and return updated template on success", async () => {
    // Arrange
    const mockDto = {
      id: "123",
      name: "Updated Template",
      description: "Updated description",
      fields: [{ name: "field1", type: "text" }],
    };

    const mockUpdatedTemplate = {
      id: "123",
      name: "Updated Template",
      description: "Updated description",
      fields: [{ name: "field1", type: "text" }],
      updatedAt: new Date().toISOString(),
    };

    // @ts-ignore
    UpdatePayOrderTemplateDto.create.mockReturnValue([null, mockDto]);
    mockExecute.mockResolvedValue(mockUpdatedTemplate);

    // Act
    await controller.updatePayOrderTemplate(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(UpdatePayOrderTemplateDto.create).toHaveBeenCalledWith(
      mockRequest.body
    );
    expect(UpdatePayOrderTemplate).toHaveBeenCalledWith(
      mockPayOrderTemplateRepository
    );
    expect(mockExecute).toHaveBeenCalledWith(mockDto);
    expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedTemplate);
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it("should return 400 if UpdatePayOrderTemplate.execute throws an error", async () => {
    // Arrange
    const mockDto = {
      id: "123",
      name: "Updated Template",
      description: "Updated description",
      fields: [{ name: "field1", type: "text" }],
    };

    const mockError = { message: "Template not found" };

    // @ts-ignore
    UpdatePayOrderTemplateDto.create.mockReturnValue([null, mockDto]);
    mockExecute.mockRejectedValue(mockError);

    // Act
    await controller.updatePayOrderTemplate(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(UpdatePayOrderTemplateDto.create).toHaveBeenCalledWith(
      mockRequest.body
    );
    expect(UpdatePayOrderTemplate).toHaveBeenCalledWith(
      mockPayOrderTemplateRepository
    );
    expect(mockExecute).toHaveBeenCalledWith(mockDto);
  });

  it("should handle empty request body", async () => {
    // Arrange
    mockRequest.body = {};
    const validationError = "Missing required fields";

    // @ts-ignore
    UpdatePayOrderTemplateDto.create.mockReturnValue([validationError, null]);

    // Act
    await controller.updatePayOrderTemplate(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(UpdatePayOrderTemplateDto.create).toHaveBeenCalledWith({});
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: validationError });
    expect(UpdatePayOrderTemplate).not.toHaveBeenCalled();
  });

  it("should handle partial updates correctly", async () => {
    // Arrange
    const partialUpdateBody = {
      id: "123",
      name: "Updated Template Name",
    };
    mockRequest.body = partialUpdateBody;

    const mockDto = { ...partialUpdateBody };
    const mockUpdatedTemplate = {
      id: "123",
      name: "Updated Template Name",
      description: "Original description",
      fields: [{ name: "originalField", type: "text" }],
      updatedAt: new Date().toISOString(),
    };

    // @ts-ignore
    UpdatePayOrderTemplateDto.create.mockReturnValue([null, mockDto]);
    mockExecute.mockResolvedValue(mockUpdatedTemplate);

    // Act
    await controller.updatePayOrderTemplate(
      mockRequest as Request,
      mockResponse as Response
    );

    // Assert
    expect(UpdatePayOrderTemplateDto.create).toHaveBeenCalledWith(
      partialUpdateBody
    );
    expect(mockExecute).toHaveBeenCalledWith(mockDto);
    expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedTemplate);
  });
});
