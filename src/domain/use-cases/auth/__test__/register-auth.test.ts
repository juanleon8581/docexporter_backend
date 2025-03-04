import { AuthDatasource } from "@/domain/datasources/auth.datasource";
import { RegisterAuth } from "../register-auth";
import { RegisterDto } from "@/domain/dtos/auth/register.dto";
import { AuthEntity } from "@/domain/entities/auth.entity";

const mockRegisterDtoData = {
  email: "test@example.com",
  name: "John",
  lastname: "Doe",
  password: "password123",
};

const mockAuthEntityJson = {
  id: "123abc",
  email: "test@example.com",
  name: "John",
  lastname: "Doe",
  access_token: "access-token-123",
  refresh_token: "refresh-token-123",
};

const mockAuthDatasource: jest.Mocked<AuthDatasource> = {
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
};

describe("RegisterAuth Use Case", () => {
  let registerAuth: RegisterAuth;

  beforeEach(() => {
    registerAuth = new RegisterAuth(mockAuthDatasource);
    jest.clearAllMocks();
  });

  it("should successfully register a user", async () => {
    const [error, registerDto] = RegisterDto.create(mockRegisterDtoData);
    expect(error).toBeUndefined();
    expect(registerDto).toBeDefined();

    const authEntity = AuthEntity.fromJson(mockAuthEntityJson);
    mockAuthDatasource.register.mockResolvedValue(authEntity);

    const result = await registerAuth.execute(registerDto!);

    expect(mockAuthDatasource.register).toHaveBeenCalledWith(registerDto);
    expect(mockAuthDatasource.register).toHaveBeenCalledTimes(1);
    expect(result).toEqual(authEntity);
    expect(result.email).toBe("test@example.com");
    expect(result.name).toBe("John");
  });

  it("should throw an error if registration fails", async () => {
    const [error, registerDto] = RegisterDto.create(mockRegisterDtoData); //
    expect(error).toBeUndefined();
    mockAuthDatasource.register.mockRejectedValue(new Error("Register failed"));

    await expect(registerAuth.execute(registerDto!)).rejects.toThrow(
      "Register failed"
    );
    expect(mockAuthDatasource.register).toHaveBeenCalledWith(registerDto);
    expect(mockAuthDatasource.register).toHaveBeenCalledTimes(1);
  });

  it("should throw an error if RegisterDto is invalid", async () => {
    const [error, registerDto] = RegisterDto.create({
      email: "test@example.com",
    });
    expect(error).toBe("Invalid Data");
    expect(registerDto).toBeUndefined();

    await expect(registerAuth.execute(registerDto as any)).rejects.toThrow();
    expect(mockAuthDatasource.register).toHaveBeenCalledTimes(1);
  });
});
