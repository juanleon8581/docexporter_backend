export class RegisterDto {
  constructor(
    public readonly email: string,
    public readonly password: string
  ) {}

  static create(props: { [key: string]: any }): [string?, RegisterDto?] {
    const { email, password } = props;

    if (!email || !password) return ["Invalid Data"];

    return [, new RegisterDto(email, password)];
  }
}
