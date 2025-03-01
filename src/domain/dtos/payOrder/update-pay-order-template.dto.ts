export class UpdatePayOrderTemplateDto {
  constructor(
    public readonly userId: string,
    public readonly id: string,
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
  }): [string?, UpdatePayOrderTemplateDto?] {
    const {
      userId,
      id,
      nameEntry,
      nameFor,
      nitFor,
      dni,
      role,
      bank,
      accountNumber,
    } = props;

    if (!userId || !id || !nameEntry) return ["Invalid Data"];

    return [
      ,
      new UpdatePayOrderTemplateDto(
        userId,
        id,
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
