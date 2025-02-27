export class PayOrderTemplateEntity {
  constructor(
    public readonly id: string,
    public readonly nameFor: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly nitFor?: string,
    public readonly dni?: string,
    public readonly role?: string,
    public readonly bank?: string,
    public readonly accountNumber?: string,
    public readonly deletedAt?: Date,
    public readonly deleted?: boolean
  ) {}

  get isDeleted(): boolean {
    return !!this.deleted;
  }

  static fromJson(json: { [key: string]: any }): PayOrderTemplateEntity {
    const {
      id,
      nameFor,
      createdAt,
      updatedAt,
      nitFor,
      dni,
      role,
      bank,
      accountNumber,
      deletedAt,
      deleted = false,
    } = json;

    if (!id || !nameFor) {
      throw new Error("Invalid JSON");
    }

    const createdAtProcessed: Date | undefined = this.processDate(createdAt);
    if (!createdAtProcessed || isNaN(createdAtProcessed.getTime())) {
      throw new Error("Invalid date");
    }

    const updatedAtProcessed: Date | undefined = this.processDate(updatedAt);
    if (!updatedAtProcessed || isNaN(updatedAtProcessed.getTime())) {
      throw new Error("Invalid date");
    }

    const deletedAtProcessed: Date | undefined = this.processDate(deletedAt);
    if (deletedAtProcessed && isNaN(deletedAtProcessed.getTime())) {
      throw new Error("Invalid date");
    }

    return new PayOrderTemplateEntity(
      id,
      nameFor,
      createdAtProcessed,
      updatedAtProcessed,
      nitFor,
      dni,
      role,
      bank,
      accountNumber,
      deletedAtProcessed,
      deleted
    );
  }

  private static processDate(date: Date): Date | undefined {
    let processedDate: Date;
    if (!date) return undefined;

    processedDate = new Date(date);

    return processedDate;
  }
}
