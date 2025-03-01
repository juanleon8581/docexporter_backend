export class CreateUserDto {
  constructor(
    public readonly name: string,
    public readonly lastname: string,
    public readonly authid: string
  ) {}

  static create(props: { [key: string]: any }): [string?, CreateUserDto?] {
    const { name, lastname, authid } = props;

    if (!name || !lastname || !authid) return ["invalid Data"];

    return [, new CreateUserDto(name, lastname, authid)];
  }
}
