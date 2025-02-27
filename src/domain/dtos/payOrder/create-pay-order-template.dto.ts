export class CreatePayOrderTemplateDto {
  constructor(
    public readonly nameEntry: string,
    public readonly nameFor?: string,
    public readonly nitFor?: string,
    public readonly dni?: string,
    public readonly role?: string,
    public readonly bank?: string,
    public readonly accountNumber?: string
  ) {}

  static create(props: {
    [key: string]: any;
  }): [string?, CreatePayOrderTemplateDto?] {
    const { nameEntry, nameFor, nitFor, dni, role, bank, accountNumber } =
      props;

    if (!nameEntry) return ["Invalid Data"];

    return [
      ,
      new CreatePayOrderTemplateDto(
        nameEntry,
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
