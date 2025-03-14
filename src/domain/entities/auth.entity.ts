import { BadRequestError } from "@/errors/bad-request-error";

export class AuthEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly lastname: string,
    public readonly accessToken?: string,
    public readonly refreshToken?: string,
    public readonly createdAt: Date = new Date()
  ) {}

  static fromJson(json: { [key: string]: any }): AuthEntity {
    const {
      id,
      email,
      name,
      lastname,
      access_token,
      refresh_token,
      created_at,
    } = json;

    if (!id || !email || !name || !lastname) {
      throw new BadRequestError("Invalid JSON for AuthEntity");
    }

    const createdAtProcessed = new Date(created_at || Date.now());
    if (isNaN(createdAtProcessed.getTime())) {
      throw new BadRequestError("Invalid date");
    }

    return new AuthEntity(
      id,
      email,
      name,
      lastname,
      access_token,
      refresh_token,
      createdAtProcessed
    );
  }
}
