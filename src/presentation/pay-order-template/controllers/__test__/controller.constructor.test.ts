import { PayOrderTemplateController } from "../controller";
import { PayOrderTemplateRepository } from "@/domain/repositories/pay-order-template.repository";

// Mock implementation of PayOrderTemplateRepository
class MockPayOrderTemplateRepository implements PayOrderTemplateRepository {
  getAll = jest.fn();
  getById = jest.fn();
  deleteById = jest.fn();
  create = jest.fn();
  update = jest.fn();
}

describe("PayOrderTemplateController", () => {
  let mockRepository: MockPayOrderTemplateRepository;

  beforeEach(() => {
    mockRepository = new MockPayOrderTemplateRepository();

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe("constructor", () => {
    it("should initialize with the provided repository", () => {
      // Act
      const controller = new PayOrderTemplateController(mockRepository);

      // Assert - verify the repository is assigned correctly
      // We need to access the private property, so we use type assertion
      // @ts-ignore - Accessing private property for testing
      expect(controller.payOrderTemplateRepository).toBe(mockRepository);
    });

    it("should maintain repository reference after initialization", () => {
      // Arrange
      const controller = new PayOrderTemplateController(mockRepository);

      // Act - create a new repository instance
      const newRepository = new MockPayOrderTemplateRepository();

      // Assert - verify the original repository is still assigned
      // @ts-ignore - Accessing private property for testing
      expect(controller.payOrderTemplateRepository).toBe(mockRepository);
      // @ts-ignore - Accessing private property for testing
      expect(controller.payOrderTemplateRepository).not.toBe(newRepository);
    });

    it("should initialize with different repositories for different instances", () => {
      // Arrange
      const repository1 = new MockPayOrderTemplateRepository();
      const repository2 = new MockPayOrderTemplateRepository();

      // Act
      const controller1 = new PayOrderTemplateController(repository1);
      const controller2 = new PayOrderTemplateController(repository2);

      // Assert
      // @ts-ignore - Accessing private property for testing
      expect(controller1.payOrderTemplateRepository).toBe(repository1);
      // @ts-ignore - Accessing private property for testing
      expect(controller2.payOrderTemplateRepository).toBe(repository2);
      // @ts-ignore - Accessing private property for testing
      expect(controller1.payOrderTemplateRepository).not.toBe(repository2);
    });
  });
});
