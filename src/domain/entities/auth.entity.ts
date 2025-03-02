export class AuthEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly accessToken?: string,
    public readonly refreshToken?: string,
    public readonly createdAt: Date = new Date()
  ) {}

  static fromJson(json: { [key: string]: any }): AuthEntity {
    const { id, email, access_token, refresh_token, created_at } = json;

    if (!id || !email) {
      throw new Error("Invalid JSON for AuthEntity");
    }

    const createdAtProcessed = new Date(created_at || Date.now());
    if (isNaN(createdAtProcessed.getTime())) {
      throw new Error("Invalid date");
    }

    return new AuthEntity(
      id,
      email,
      access_token,
      refresh_token,
      createdAtProcessed
    );
  }
}
