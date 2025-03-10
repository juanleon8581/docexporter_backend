import { AuthController } from "../controller";
import { AuthRepository } from "@/domain/repositories/auth.repository";
import { AuthDatasource } from "@/domain/datasources/auth.datasource";

// Mock implementations
class MockAuthDatasource implements AuthDatasource {
  login = jest.fn();
  register = jest.fn();
  logout = jest.fn();
}

class MockAuthRepository implements AuthRepository {
  constructor(private readonly datasource: AuthDatasource) {}

  login = jest.fn();
  register = jest.fn();
  logout = jest.fn();
}

describe("AuthController", () => {
  let mockDatasource: MockAuthDatasource;
  let mockRepository: MockAuthRepository;

  beforeEach(() => {
    mockDatasource = new MockAuthDatasource();
    mockRepository = new MockAuthRepository(mockDatasource);

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe("constructor", () => {
    it("should initialize with the provided repository", () => {
      // Act
      const controller = new AuthController(mockRepository);

      // Assert - verify the repository is assigned correctly
      // We need to access the private property, so we use type assertion
      // @ts-ignore - Accessing private property for testing
      expect(controller.repository).toBe(mockRepository);
    });

    it("should maintain repository reference after initialization", () => {
      // Arrange
      const controller = new AuthController(mockRepository);

      // Act - create a new repository instance
      const newRepository = new MockAuthRepository(mockDatasource);

      // Assert - verify the original repository is still assigned
      // @ts-ignore - Accessing private property for testing
      expect(controller.repository).toBe(mockRepository);
      // @ts-ignore - Accessing private property for testing
      expect(controller.repository).not.toBe(newRepository);
    });

    it("should initialize with different repositories for different instances", () => {
      // Arrange
      const repository1 = new MockAuthRepository(mockDatasource);
      const repository2 = new MockAuthRepository(mockDatasource);

      // Act
      const controller1 = new AuthController(repository1);
      const controller2 = new AuthController(repository2);

      // Assert
      // @ts-ignore - Accessing private property for testing
      expect(controller1.repository).toBe(repository1);
      // @ts-ignore - Accessing private property for testing
      expect(controller2.repository).toBe(repository2);
      // @ts-ignore - Accessing private property for testing
      expect(controller1.repository).not.toBe(controller2.repository);
    });
  });
});
