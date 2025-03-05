import { RegisterDto } from "../register.dto";

describe("RegisterDto.create", () => {
  const validData = {
    name: "John",
    lastname: "Doe",
    email: "test@example.com",
    password: "password123",
  };

  it("should create a RegisterDto instance with valid data", () => {
    // Act
    const [error, registerDto] = RegisterDto.create(validData);

    // Assert
    expect(error).toBeUndefined();
    expect(registerDto).toBeInstanceOf(RegisterDto);
    expect(registerDto!.email).toEqual(validData.email);
    expect(registerDto!.password).toEqual(validData.password);
    expect(registerDto!.name).toEqual(validData.name);
    expect(registerDto!.lastname).toEqual(validData.lastname);
  });

  it("should return an error if name is missing", () => {
    // Arrange
    const invalidData = { ...validData, name: undefined };

    // Act
    const [error, registerDto] = RegisterDto.create(invalidData);

    // Assert
    expect(error).toBe("Invalid Data");
    expect(registerDto).toBeUndefined();
  });

  it("should return an error if lastname is missing", () => {
    // Arrange
    const invalidData = { ...validData, lastname: undefined };

    // Act
    const [error, registerDto] = RegisterDto.create(invalidData);

    // Assert
    expect(error).toBe("Invalid Data");
    expect(registerDto).toBeUndefined();
  });

  it("should return an error if email is missing", () => {
    // Arrange
    const invalidData = { ...validData, email: undefined };

    // Act
    const [error, registerDto] = RegisterDto.create(invalidData);

    // Assert
    expect(error).toBe("Invalid Data");
    expect(registerDto).toBeUndefined();
  });

  it("should return an error if password is missing", () => {
    // Arrange
    const invalidData = { ...validData, password: undefined };

    // Act
    const [error, registerDto] = RegisterDto.create(invalidData);

    // Assert
    expect(error).toBe("Invalid Data");
    expect(registerDto).toBeUndefined();
  });

  it("should return an error if all fields are missing", () => {
    // Act
    const [error, registerDto] = RegisterDto.create({});

    // Assert
    expect(error).toBe("Invalid Data");
    expect(registerDto).toBeUndefined();
  });

  it("should ignore extra properties and create a RegisterDto with valid data", () => {
    // Arrange
    const dataWithExtra = {
      ...validData,
      extraField: "something",
      another: 123,
    };

    // Act
    const [error, registerDto] = RegisterDto.create(dataWithExtra);

    // Assert
    expect(error).toBeUndefined();
    expect(registerDto).toBeInstanceOf(RegisterDto);
    expect(registerDto!.email).toEqual(validData.email);
    expect(registerDto!.password).toEqual(validData.password);
    expect(registerDto!.name).toEqual(validData.name);
    expect(registerDto!.lastname).toEqual(validData.lastname);
    expect((registerDto as any).extraField).toBeUndefined(); // Verify that no extra properties are included
  });
});
