import { AuthEntity } from "../auth.entity";
import { BadRequestError } from "@/errors/bad-request-error";

describe("AuthEntity", () => {
  describe("fromJson", () => {
    const mockDate = new Date("2023-01-01T00:00:00.000Z");

    beforeEach(() => {
      jest.spyOn(Date, "now").mockImplementation(() => mockDate.getTime());
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    const validJson = {
      id: "123",
      email: "test@example.com",
      name: "John",
      lastname: "Doe",
      access_token: "access-token-123",
      refresh_token: "refresh-token-123",
      created_at: "2023-01-01T00:00:00.000Z",
    };

    it("should create an AuthEntity from valid JSON with all fields", () => {
      // Arrange & Act
      const result = AuthEntity.fromJson(validJson);

      // Assert
      expect(result).toBeInstanceOf(AuthEntity);
      expect(result.id).toBe("123");
      expect(result.email).toBe("test@example.com");
      expect(result.name).toBe("John");
      expect(result.lastname).toBe("Doe");
      expect(result.accessToken).toBe("access-token-123");
      expect(result.refreshToken).toBe("refresh-token-123");
      expect(result.createdAt).toEqual(new Date("2023-01-01T00:00:00.000Z"));
    });

    it("should create an AuthEntity without optional tokens", () => {
      const minimalJson = {
        id: "123",
        email: "test@example.com",
        name: "John",
        lastname: "Doe",
        created_at: "2023-01-01T00:00:00.000Z",
      };

      const result = AuthEntity.fromJson(minimalJson);

      expect(result).toBeInstanceOf(AuthEntity);
      expect(result.accessToken).toBeUndefined();
      expect(result.refreshToken).toBeUndefined();
    });

    it("should use current date when created_at is not provided", () => {
      const jsonWithoutCreatedAt = {
        ...validJson,
        created_at: undefined,
      };

      const result = AuthEntity.fromJson(jsonWithoutCreatedAt);
      expect(result.createdAt).toEqual(mockDate);
    });

    it("should throw BadRequestError when id is missing", () => {
      const invalidJson = { ...validJson, id: undefined };
      expect(() => AuthEntity.fromJson(invalidJson)).toThrow(
        new BadRequestError("Invalid JSON for AuthEntity")
      );
    });

    it("should throw BadRequestError when email is missing", () => {
      const invalidJson = { ...validJson, email: undefined };
      expect(() => AuthEntity.fromJson(invalidJson)).toThrow(
        new BadRequestError("Invalid JSON for AuthEntity")
      );
    });

    it("should throw BadRequestError when name is missing", () => {
      const invalidJson = { ...validJson, name: undefined };
      expect(() => AuthEntity.fromJson(invalidJson)).toThrow(
        new BadRequestError("Invalid JSON for AuthEntity")
      );
    });

    it("should throw BadRequestError when lastname is missing", () => {
      const invalidJson = { ...validJson, lastname: undefined };
      expect(() => AuthEntity.fromJson(invalidJson)).toThrow(
        new BadRequestError("Invalid JSON for AuthEntity")
      );
    });

    it("should throw BadRequestError when created_at is invalid", () => {
      const invalidJson = { ...validJson, created_at: "invalid-date" };
      expect(() => AuthEntity.fromJson(invalidJson)).toThrow(
        new BadRequestError("Invalid date")
      );
    });
  });
});
