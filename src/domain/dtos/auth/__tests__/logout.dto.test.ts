import { LogoutDto } from "../logout.dto";

describe("LogoutDto.create", () => {
  const validData = {
    accessToken: "access_token_1234",
  };

  it("should create a LogoutDto instance with valid data", () => {
    // act
    const [error, logOutDto] = LogoutDto.create(validData);

    // assert
    expect(error).toBeUndefined();
    expect(logOutDto).toBeInstanceOf(LogoutDto);
    expect(logOutDto!.accessToken).toBe(validData.accessToken);
  });

  it("should return an error if accessToken is missing", () => {
    // act
    const [error, logOutDto] = LogoutDto.create({});

    // assert
    expect(error).toBe("Invalid Data");
    expect(logOutDto).toBeUndefined();
  });

  it("should return an error if accessToken is an empty string", () => {
    // act
    const [error, logOutDto] = LogoutDto.create({ accessToken: "" });

    // assert
    expect(error).toBe("Invalid Data");
    expect(logOutDto).toBeUndefined();
  });

  it("should return an error if accessToken is an null", () => {
    // act
    const [error, logOutDto] = LogoutDto.create({ accessToken: null });

    // assert
    expect(error).toBe("Invalid Data");
    expect(logOutDto).toBeUndefined();
  });

  it("should ignore extra properties and create a LogoutDto with valid data", () => {
    // arrange
    const extraData = {
      ...validData,
      extraData: "extraData",
      another: 123,
    };

    // act
    const [error, logOutDto] = LogoutDto.create(extraData);

    // assert
    expect(error).toBeUndefined;
    expect(logOutDto).toBeInstanceOf(LogoutDto);
    expect(logOutDto!.accessToken).toBe(validData.accessToken);
    expect((logOutDto as any).extraData).toBeUndefined();
    expect((logOutDto as any).another).toBeUndefined();
  });
});
