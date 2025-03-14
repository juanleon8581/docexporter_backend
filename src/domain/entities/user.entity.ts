import { BadRequestError } from "@/errors/bad-request-error";

export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly authId: string,
    public readonly name: string,
    public readonly lastname: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deleted?: boolean,
    public readonly deletedAt?: Date
  ) {}

  get isDeleted(): boolean {
    return !!this.deleted;
  }

  static fromJson(json: { [key: string]: any }): UserEntity {
    const {
      id,
      authId,
      name,
      lastname,
      deleted = false,
      createdAt,
      updatedAt,
      deletedAt,
    } = json;

    if (!id || !name || !lastname || !authId || !createdAt) {
      throw new BadRequestError("Invalid JSON");
    }

    const createdAtProcessed: Date | undefined = this.processDate(createdAt);
    if (!createdAtProcessed || isNaN(createdAtProcessed.getTime())) {
      throw new BadRequestError("Invalid date");
    }

    const updatedAtProcessed: Date | undefined = this.processDate(updatedAt);
    if (!updatedAtProcessed || isNaN(updatedAtProcessed.getTime())) {
      throw new BadRequestError("Invalid date");
    }

    const deletedAtProcessed: Date | undefined = this.processDate(deletedAt);
    if (deletedAtProcessed && isNaN(deletedAtProcessed.getTime())) {
      throw new BadRequestError("Invalid date");
    }

    return new UserEntity(
      id,
      authId,
      name,
      lastname,
      createdAtProcessed,
      updatedAtProcessed,
      deleted,
      deletedAtProcessed
    );
  }

  private static processDate(date: Date): Date | undefined {
    let processedDate: Date;
    if (!date) return undefined;

    processedDate = new Date(date);

    return processedDate;
  }
}
