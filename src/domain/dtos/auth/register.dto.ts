export class RegisterDto {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly nickName: string
  ) {}

  static create(props: { [key: string]: any }): [string?, RegisterDto?] {
    const { email, password, nickName } = props;

    if (!email || !password || !nickName) return ["Invalid Data"];

    return [, new RegisterDto(email, password, nickName)];
  }
}
