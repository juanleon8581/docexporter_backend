export class UpdatePayOrderTemplateDto {
  constructor(
    public readonly id: string,
    public readonly nameFor: string,
    public readonly nitFor?: string,
    public readonly dni?: string,
    public readonly role?: string,
    public readonly bank?: string,
    public readonly accountNumber?: string
  ) {}

  static create(props: {
    [key: string]: any;
  }): [string?, UpdatePayOrderTemplateDto?] {
    const { id, nameFor, nitFor, dni, role, bank, accountNumber } = props;

    if (!id || !nameFor) return ["Invalid Data"];

    return [
      ,
      new UpdatePayOrderTemplateDto(
        id,
        nameFor,
        nitFor,
        dni,
        role,
        bank,
        accountNumber
      ),
    ];
  }
}
