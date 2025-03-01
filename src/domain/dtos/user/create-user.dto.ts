export class CreateUserDto {
  constructor(
    public readonly name: string,
    public readonly lastname: string,
    public readonly authId: string
  ) {}

  static create(props: { [key: string]: any }): [string?, CreateUserDto?] {
    const { name, lastname, authId } = props;

    if (!name || !lastname || !authId) return ["invalid Data"];

    return [, new CreateUserDto(name, lastname, authId)];
  }
}
