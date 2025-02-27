import { CreateUserDto, UpdateUserDto } from "../dtos";
import { UserEntity } from "../entities";

export abstract class UserRepository {
  abstract create(createUserDto: CreateUserDto): Promise<UserEntity>;

  abstract update(updateDto: UpdateUserDto): Promise<UserEntity>;

  abstract getAll(): Promise<UserEntity[]>;

  abstract getById(id: string): Promise<UserEntity>;

  abstract deleteById(id: string): Promise<UserEntity>;
}
