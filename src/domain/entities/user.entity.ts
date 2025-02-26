export class UserEntity {
  public name: string;
  public lastName: string;
  public authId: string;

  constructor(name: string, lastName: string, authId: string) {
    this.name = name;
    this.lastName = lastName;
    this.authId = authId;
  }
}
