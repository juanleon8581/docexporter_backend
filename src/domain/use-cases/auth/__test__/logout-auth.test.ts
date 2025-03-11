import { AuthDatasource } from "@/domain/datasources/auth.datasource";
import { LogoutAuth } from "../logout-auth";
import { LogoutDto } from "@/domain/dtos/auth/logout.dto";

const mockAuthDatasource: jest.Mocked<AuthDatasource> = {
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
};

describe("LogoutAuth Use Case", () => {
  let logoutAuth: LogoutAuth;

  beforeEach(() => {
    logoutAuth = new LogoutAuth(mockAuthDatasource);
    jest.clearAllMocks();
  });

  it("should successfully logout a user", async () => {
    const [, logOutDto] = LogoutDto.create({
      accessToken: "test-access-token",
    });

    mockAuthDatasource.logout.mockResolvedValue(undefined);

    const result = await logoutAuth.execute(logOutDto!);

    expect(logOutDto).not.toBeUndefined();
    expect(mockAuthDatasource.logout).toHaveBeenCalledWith(logOutDto);
    expect(mockAuthDatasource.logout).toHaveBeenCalledTimes(1);
    expect(result).toBeUndefined();
  });

  it("should throw an error if logout fails", async () => {
    const [error, logoutDto] = LogoutDto.create({
      accessToken: "test-access-token",
    });
    expect(error).toBeUndefined();
    expect(logoutDto).toBeDefined();

    mockAuthDatasource.logout.mockRejectedValue(new Error("Logout failed"));

    await expect(logoutAuth.execute(logoutDto!)).rejects.toThrow(
      "Logout failed"
    );
    expect(mockAuthDatasource.logout).toHaveBeenCalledWith(logoutDto);
    expect(mockAuthDatasource.logout).toHaveBeenCalledTimes(1);
  });
});
