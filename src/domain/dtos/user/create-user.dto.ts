export class CreateUserDto {
  constructor(
    public readonly name: string,
    public readonly lastName: string,
    public readonly authId: string
  ) {}

  static create(props: { [key: string]: any }): [string?, CreateUserDto?] {
    const { name, lastname, authId } = props;

    if (!name) return ["invalid Data"];
    if (!lastname) return ["invalid Data"];
    if (!authId) return ["invalid Data"];

    return [, new CreateUserDto(name, lastname, authId)];
  }
}
