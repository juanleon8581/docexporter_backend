export class UpdateUserDto {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly lastname?: string
  ) {}

  get values() {
    const values: { [key: string]: any } = {};
    if (this.name) values.name = this.name;
    if (this.lastname) values.lastname = this.lastname;

    return values;
  }

  static create(props: { [key: string]: any }): [string?, UpdateUserDto?] {
    const { id, name, lastname } = props;
    if (!id) return ["invalid Data"];

    return [, new UpdateUserDto(id, name, lastname)];
  }
}
