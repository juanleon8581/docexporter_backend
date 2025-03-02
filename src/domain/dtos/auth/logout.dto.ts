export class LogoutDto {
  constructor(public readonly accessToken: string) {}

  static create(props: { [key: string]: any }): [string?, LogoutDto?] {
    const { accessToken } = props;

    if (!accessToken) return ["Invalid Data"];

    return [, new LogoutDto(accessToken)];
  }
}
