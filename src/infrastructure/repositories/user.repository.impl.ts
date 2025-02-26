import { UserDataSource } from "@/domain/datasources";
import { CreateUserDto } from "@/domain/dtos";
import { UserEntity } from "@/domain/entities";
import { UserRepository } from "@/domain/repositories";

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly datasource: UserDataSource) {}
  create(createUserDto: CreateUserDto): Promise<UserEntity> {
    throw new Error("Method not implemented.");
  }
  getAll(): Promise<UserEntity[]> {
    throw new Error("Method not implemented.");
  }
  getById(id: string): Promise<UserEntity> {
    throw new Error("Method not implemented.");
  }
  deleteById(id: string): Promise<UserEntity> {
    throw new Error("Method not implemented.");
  }
}
