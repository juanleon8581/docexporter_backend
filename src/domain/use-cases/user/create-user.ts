import { CreateUserDto } from "@/domain/dtos";
import { UserEntity } from "@/domain/entities";
import { UserRepository } from "@/domain/repositories";

interface CreateUserUseCase {
  execute(dto: CreateUserDto): Promise<UserEntity>;
}

export class CreateUser implements CreateUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  execute(dto: CreateUserDto): Promise<UserEntity> {
    return this.repository.create(dto);
  }
}
