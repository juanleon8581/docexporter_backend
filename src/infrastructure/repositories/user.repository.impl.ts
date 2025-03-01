import { UserDataSource } from "@/domain/datasources";
import { CreateUserDto, UpdateUserDto } from "@/domain/dtos";
import { UserEntity } from "@/domain/entities";
import { UserRepository } from "@/domain/repositories";

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly datasource: UserDataSource) {}

  create(createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.datasource.create(createUserDto);
  }

  update(updateDto: UpdateUserDto): Promise<UserEntity> {
    return this.datasource.update(updateDto);
  }

  getAll(): Promise<UserEntity[]> {
    return this.datasource.getAll();
  }

  getById(id: string): Promise<UserEntity> {
    return this.datasource.getById(id);
  }

  deleteById(id: string): Promise<UserEntity> {
    return this.datasource.deleteById(id);
  }
}
