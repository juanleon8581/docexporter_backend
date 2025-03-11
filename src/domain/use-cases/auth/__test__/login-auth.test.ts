import { LoginAuth } from "../login-auth";
import { AuthDatasource } from "@/domain/datasources/auth.datasource";
import { LoginDto } from "@/domain/dtos/auth/login.dto";
import { AuthEntity } from "@/domain/entities/auth.entity";

const mockAuthDatasource: jest.Mocked<AuthDatasource> = {
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
};

const loginInfo = {
  email: "test@example.com",
  password: "password123",
};

const authEntityJson = {
  id: "123abc",
  email: "test@example.com",
  name: "John",
  lastname: "Doe",
  access_token: "access-token-123",
  refresh_token: "refresh-token-123",
};

describe("LoginAuth Use Case", () => {
  let loginAuth: LoginAuth;

  beforeEach(() => {
    loginAuth = new LoginAuth(mockAuthDatasource);
    jest.clearAllMocks();
  });

  it("should successfully login a user and return an AuthEntity", async () => {
    const [, loginDto] = LoginDto.create(loginInfo);
    const authEntity = AuthEntity.fromJson(authEntityJson);
    mockAuthDatasource.login.mockResolvedValue(authEntity);

    const result = await loginAuth.execute(loginDto!);

    expect(mockAuthDatasource.login).toHaveBeenCalledWith(loginDto);
    expect(mockAuthDatasource.login).toHaveBeenCalledTimes(1);
    expect(result).toBe(authEntity);
    expect(result.email).toBe("test@example.com");
  });

  it("should throw an error if login fails", async () => {
    const [error, loginDto] = LoginDto.create(loginInfo);
    expect(error).toBeUndefined();
    expect(loginDto).toBeDefined();

    mockAuthDatasource.login.mockRejectedValue(
      new Error("Invalid credentials")
    );

    await expect(loginAuth.execute(loginDto!)).rejects.toThrow(
      "Invalid credentials"
    );
    expect(mockAuthDatasource.login).toHaveBeenCalledWith(loginDto);
    expect(mockAuthDatasource.login).toHaveBeenCalledTimes(1);
  });
});
