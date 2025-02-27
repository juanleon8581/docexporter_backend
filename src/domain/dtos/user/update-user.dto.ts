export class UpdateUserDto {
  constructor(public readonly name: string, public readonly lastname: string) {}

  static create(props: { [key: string]: any }): [string?, UpdateUserDto?] {
    const { name, lastname } = props;
    if (!name || !lastname) return ["invalid Data"];

    return [, new UpdateUserDto(name, lastname)];
  }
}
