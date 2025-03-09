// File: src/infrastructure/datasource/__test__/auth.datasource.impl.test.ts

import { AuthDatasourceImpl } from "../auth.datasource.impl";
import { RegisterDto } from "@/domain/dtos/auth/register.dto";
import { LoginDto } from "@/domain/dtos/auth/login.dto";
import { LogoutDto } from "@/domain/dtos/auth/logout.dto";
import { AuthEntity } from "@/domain/entities/auth.entity";
import { BadRequestError } from "@/errors/bad-request-error";
import { NotFoundError } from "@/errors/not-found-error";
import { UnauthorizedError } from "@/errors/unauthorized-error";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/data/postgres";
import envs from "@/config/envs";

// Envs mock

jest.mock("@/config/envs", () => ({
  envs: {},
}));

// Mock Supabase and Prisma
jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn().mockReturnValue({
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
    },
  }),
}));

jest.mock("@/data/postgres", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

describe("AuthDatasourceImpl", () => {
  let datasource: AuthDatasourceImpl;
  let mockSupabase: any;

  beforeEach(() => {
    // Reset mocks and initialize datasource
    jest.clearAllMocks();
    mockSupabase = createClient("", ""); // Mocked client from jest.mock
    datasource = new AuthDatasourceImpl();
  });

  // Helper function to mock Supabase user response
  const mockUserResponse = {
    user: {
      id: "user123",
      email: "test@example.com",
    },
    session: {
      access_token: "access-token-123",
      refresh_token: "refresh-token-123",
    },
  };

  const mockDbUser = {
    authId: "user123",
    name: "John",
    lastname: "Doe",
    deleted: false,
  };

  // === Register Tests ===
  describe("register", () => {
    const registerDto: RegisterDto = {
      email: "test@example.com",
      password: "password123",
      name: "John",
      lastname: "Doe",
    };

    it("should successfully register a user and return AuthEntity", async () => {
      // Arrange
      mockSupabase.auth.signUp.mockResolvedValue({
        data: mockUserResponse,
        error: null,
      });

      // Act
      const result = await datasource.register(registerDto);

      // Assert
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: registerDto.email,
        password: registerDto.password,
      });
      expect(result).toBeInstanceOf(AuthEntity);
      expect(result.id).toBe("user123");
      expect(result.email).toBe("test@example.com");
      expect(result.name).toBe("John");
      expect(result.lastname).toBe("Doe");
      expect(result.accessToken).toBe("access-token-123");
      expect(result.refreshToken).toBe("refresh-token-123");
    });

    it("should throw BadRequestError if Supabase signUp returns an error", async () => {
      // Arrange
      mockSupabase.auth.signUp.mockResolvedValue({
        data: null,
        error: { message: "Email already exists" },
      });

      // Act & Assert
      await expect(datasource.register(registerDto)).rejects.toThrow(
        new BadRequestError("Email already exists")
      );
      expect(mockSupabase.auth.signUp).toHaveBeenCalledTimes(1);
    });

    it("should throw NotFoundError if Supabase returns no user", async () => {
      // Arrange
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: null, session: null },
        error: null,
      });

      // Act & Assert
      await expect(datasource.register(registerDto)).rejects.toThrow(
        new NotFoundError("Invalid User")
      );
    });

    it("should handle special characters in email and password", async () => {
      // Arrange
      const specialDto: RegisterDto = {
        email: "test+special@domain.com",
        password: "pass!@#$%^",
        name: "John",
        lastname: "Doe",
      };
      mockSupabase.auth.signUp.mockResolvedValue({
        data: {
          user: { id: "user123", email: "test+special@domain.com" },
          session: mockUserResponse.session,
        },
        error: null,
      });

      // Act
      const result = await datasource.register(specialDto);

      // Assert
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: specialDto.email,
        password: specialDto.password,
      });
      expect(result.email).toBe("test+special@domain.com");
    });
  });

  // === Login Tests ===
  describe("login", () => {
    const loginDto: LoginDto = {
      email: "test@example.com",
      password: "password123",
    };

    it("should successfully login a user and return AuthEntity", async () => {
      // Arrange
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: mockUserResponse,
        error: null,
      });
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockDbUser);

      // Act
      const result = await datasource.login(loginDto);

      // Assert
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: loginDto.email,
        password: loginDto.password,
      });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { authId: "user123", deleted: false },
      });
      expect(result).toBeInstanceOf(AuthEntity);
      expect(result.id).toBe("user123");
      expect(result.email).toBe("test@example.com");
      expect(result.name).toBe("John");
      expect(result.lastname).toBe("Doe");
      expect(result.accessToken).toBe("access-token-123");
    });

    it("should throw BadRequestError if Supabase login fails", async () => {
      // Arrange
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: "Invalid credentials" },
      });

      // Act & Assert
      await expect(datasource.login(loginDto)).rejects.toThrow(
        new BadRequestError("Invalid credentials")
      );
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledTimes(1);
    });

    it("should throw NotFoundError if no user or session is returned", async () => {
      // Arrange
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: null,
      });

      // Act & Assert
      await expect(datasource.login(loginDto)).rejects.toThrow(
        new NotFoundError("Invalid User or Password")
      );
    });

    it("should throw NotFoundError if Prisma user is not found", async () => {
      // Arrange
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: mockUserResponse,
        error: null,
      });
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(datasource.login(loginDto)).rejects.toThrow(
        new NotFoundError("Invalid User or Password")
      );
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { authId: "user123", deleted: false },
      });
    });
  });

  // === Logout Tests ===
  describe("logout", () => {
    const logoutDto: LogoutDto = {
      accessToken: "access-token-123",
    };

    it("should successfully logout a user", async () => {
      // Arrange
      mockSupabase.auth.signOut.mockResolvedValue({ error: null });

      // Act
      await datasource.logout(logoutDto);

      // Assert
      expect(mockSupabase.auth.signOut).toHaveBeenCalledWith({
        scope: "global",
      });
      expect(mockSupabase.auth.signOut).toHaveBeenCalledTimes(1);
    });

    it("should throw UnauthorizedError if logout fails", async () => {
      // Arrange
      mockSupabase.auth.signOut.mockResolvedValue({
        error: { message: "Invalid token" },
      });

      // Act & Assert
      await expect(datasource.logout(logoutDto)).rejects.toThrow(
        new UnauthorizedError("Invalid token")
      );
      expect(mockSupabase.auth.signOut).toHaveBeenCalledTimes(1);
    });

    it("should call signOut with global scope", async () => {
      // Arrange
      mockSupabase.auth.signOut.mockResolvedValue({ error: null });

      // Act
      await datasource.logout(logoutDto);

      // Assert
      expect(mockSupabase.auth.signOut).toHaveBeenCalledWith({
        scope: "global",
      });
    });
  });
});
