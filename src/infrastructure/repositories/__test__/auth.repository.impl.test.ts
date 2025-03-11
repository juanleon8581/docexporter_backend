import { AuthRepositoryImpl } from "../auth.repository.impl";
import { AuthDatasource } from "@/domain/datasources/auth.datasource";
import { RegisterDto } from "@/domain/dtos/auth/register.dto";
import { LoginDto } from "@/domain/dtos/auth/login.dto";
import { LogoutDto } from "@/domain/dtos/auth/logout.dto";
import { AuthEntity } from "@/domain/entities/auth.entity";

const mockAuthEntity: AuthEntity = {
  id: "1",
  name: "Joe",
  lastname: "Doe",
  accessToken: "token123",
  createdAt: new Date(),
  email: "test@test.com",
};
describe("AuthRepositoryImpl", () => {
  let repository: AuthRepositoryImpl;
  let mockDatasource: jest.Mocked<AuthDatasource>;

  beforeEach(() => {
    // Create mock datasource
    mockDatasource = {
      register: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
    };

    // Initialize repository with mock datasource
    repository = new AuthRepositoryImpl(mockDatasource);

    jest.clearAllMocks();
  });

  describe("constructor", () => {
    it("should create an instance with the provided datasource", () => {
      // Assert
      expect(repository).toBeInstanceOf(AuthRepositoryImpl);
    });

    it("should properly assign the datasource to the instance", () => {
      // Assert - We need to test that the datasource is properly assigned
      // by verifying that methods call the datasource methods
      const registerDto: RegisterDto = {
        name: "Joe",
        lastname: "Doe",
        password: "password",
        email: "test@example.com",
      };
      repository.register(registerDto);
      expect(mockDatasource.register).toHaveBeenCalledWith(registerDto);
    });

    it("should properly delegate register method to datasource", () => {
      // Arrange
      mockDatasource.register = jest.fn().mockResolvedValue(mockAuthEntity);

      const repository = new AuthRepositoryImpl(mockDatasource);
      const registerDto: RegisterDto = {
        name: "Joe",
        lastname: "Doe",
        password: "password",
        email: "test@example.com",
      };

      // Act
      const result = repository.register(registerDto);

      // Assert
      expect(mockDatasource.register).toHaveBeenCalledWith(registerDto);
      expect(result).resolves.toEqual(mockAuthEntity);
    });

    it("should properly delegate login method to datasource", () => {
      // Arrange
      mockDatasource.login = jest.fn().mockResolvedValue(mockAuthEntity);

      const repository = new AuthRepositoryImpl(mockDatasource);
      const loginDto: LoginDto = {
        email: "test@test.com",
        password: "password",
      };

      // Act
      const result = repository.login(loginDto);

      // Assert
      expect(mockDatasource.login).toHaveBeenCalledWith(loginDto);
      expect(result).resolves.toEqual(mockAuthEntity);
    });

    it("should properly delegate logout method to datasource", () => {
      // Arrange
      const mockDatasource: AuthDatasource = {
        register: jest.fn(),
        login: jest.fn(),
        logout: jest.fn().mockResolvedValue(undefined),
      };

      const repository = new AuthRepositoryImpl(mockDatasource);
      const logoutDto: LogoutDto = {
        accessToken: "token123",
      };

      // Act
      const result = repository.logout(logoutDto);

      // Assert
      expect(mockDatasource.logout).toHaveBeenCalledWith(logoutDto);
      expect(result).resolves.toBeUndefined();
    });
  });

  describe("register", () => {
    it("should call datasource.register with provided dto", async () => {
      // Arrange
      const registerDto: RegisterDto = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
        lastname: "Test User",
      };

      const expectedResponse: AuthEntity = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
        lastname: "Test User",
        accessToken: "jwt-token",
        createdAt: new Date(),
      };

      mockDatasource.register.mockResolvedValue(expectedResponse);

      // Act
      const result = await repository.register(registerDto);

      // Assert
      expect(mockDatasource.register).toHaveBeenCalledWith(registerDto);
      expect(mockDatasource.register).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResponse);
    });

    it("should throw error when datasource.register fails", async () => {
      // Arrange
      const registerDto: RegisterDto = {
        email: "test@example.com",
        password: "password123",
        name: "Joe",
        lastname: "Doe",
      };

      const expectedError = new Error("Registration failed");
      mockDatasource.register.mockRejectedValue(expectedError);

      // Act & Assert
      await expect(repository.register(registerDto)).rejects.toThrow(
        expectedError
      );
      expect(mockDatasource.register).toHaveBeenCalledWith(registerDto);
      expect(mockDatasource.register).toHaveBeenCalledTimes(1);
    });

    it("should handle empty dto fields", async () => {
      // Arrange
      const registerDto: RegisterDto = {
        email: "",
        lastname: "",
        password: "",
        name: "",
      };

      const expectedResponse: AuthEntity = {
        id: "1",
        email: "",
        name: "",
        lastname: "",
        accessToken: "jwt-token",
        createdAt: new Date(),
      };

      mockDatasource.register.mockResolvedValue(expectedResponse);

      // Act
      const result = await repository.register(registerDto);

      // Assert
      expect(mockDatasource.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(expectedResponse);
    });

    it("should pass through special characters in dto", async () => {
      // Arrange
      const registerDto: RegisterDto = {
        email: "test+special@example.com",
        password: "pass!@#$%^&*()",
        name: "Joe 你好",
        lastname: "Doe 你好",
      };

      const expectedResponse: AuthEntity = {
        id: "1",
        email: "test+special@example.com",
        name: "Test User 你好",
        lastname: "Test User 你好",
        accessToken: "jwt-token",
        createdAt: new Date(),
      };

      mockDatasource.register.mockResolvedValue(expectedResponse);

      // Act
      const result = await repository.register(registerDto);

      // Assert
      expect(mockDatasource.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe("login", () => {
    const loginDto: LoginDto = {
      email: "test@test.com",
      password: "password",
    };
    it("should call Datasource login with the dto", async () => {
      // Arrange

      mockDatasource.login.mockResolvedValue(mockAuthEntity);

      // Act

      const result = await repository.login(loginDto);
      // Assert
      expect(mockDatasource.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(mockAuthEntity);
    });

    it("should throw error when bad dto", () => {
      // Arrange

      const expectedError = new Error("Registration failed");
      mockDatasource.login.mockRejectedValue(expectedError);

      // Act

      // Assert
      expect(repository.login(loginDto)).rejects.toThrow(expectedError);
      expect(mockDatasource.login).toHaveBeenCalledWith(loginDto);
      expect(mockDatasource.login).toHaveBeenCalledTimes(1);
    });
  });

  describe("logout", () => {
    const logoutDto: LogoutDto = {
      accessToken: "token123",
    };

    it("should do logout", () => {
      // Assert
      expect(repository.logout(logoutDto)).toBeUndefined();
      expect(mockDatasource.logout).toHaveBeenCalledWith(logoutDto);
      expect(mockDatasource.logout).toHaveBeenCalledTimes(1);
    });
  });
});
