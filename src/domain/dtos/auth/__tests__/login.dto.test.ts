import { LoginDto } from "../login.dto";

describe("LoginDto.create", () => {
  const validData = {
    email: "testemail@test.com",
    password: "pass123456",
  };

  it("should create a LoginDto instance with valid data", () => {
    // Act
    const [error, loginDto] = LoginDto.create(validData);

    // Assert
    expect(error).toBeUndefined();
    expect(loginDto).toBeInstanceOf(LoginDto);
    expect(loginDto!.email).toBe(validData.email);
    expect(loginDto!.password).toBe(validData.password);
  });

  it("should return an error if email is missing", () => {
    // Arrange
    const invalidData = { ...validData, email: undefined };

    // act
    const [error, loginDto] = LoginDto.create(invalidData);

    // Assert
    expect(error).toBe("Invalid Data");
    expect(loginDto).toBeUndefined();
  });

  it("should return an error if password is missing", () => {
    // Arrange
    const invalidData = { ...validData, password: undefined };

    // act
    const [error, loginDto] = LoginDto.create(invalidData);

    // Assert
    expect(error).toBe("Invalid Data");
    expect(loginDto).toBeUndefined();
  });

  it("should return an error if all keys are missing", () => {
    // act
    const [error, loginDto] = LoginDto.create({});

    // Assert
    expect(error).toBe("Invalid Data");
    expect(loginDto).toBeUndefined();
  });

  it("should ignore extra properties and create a loginDto with valid data", () => {
    // Arrange
    const extraData = {
      ...validData,
      extraData: "extraData",
      another: 123,
    };

    // Act
    const [error, loginDto] = LoginDto.create(extraData);

    // assert
    expect(error).toBeUndefined;
    expect(loginDto).toBeInstanceOf(LoginDto);
    expect(loginDto!.email).toBe(validData.email);
    expect(loginDto!.password).toBe(validData.password);
    expect((loginDto as any).extraData).toBeUndefined();
    expect((loginDto as any).another).toBeUndefined();
  });
});
