import { CreateUserDto } from "../dtos";
import { UserEntity } from "../entities";

export abstract class UserDataSource {
  abstract create(createUserDto: CreateUserDto): Promise<UserEntity>;

  abstract getAll(): Promise<UserEntity[]>;

  abstract getById(id: string): Promise<UserEntity>;

  abstract deleteById(id: string): Promise<UserEntity>;
}
