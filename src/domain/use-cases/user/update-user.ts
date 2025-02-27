import { UpdateUserDto } from "@/domain/dtos";
import { UserEntity } from "@/domain/entities";
import { UserRepository } from "@/domain/repositories";

export interface UpdateUser {
  execute(dto: UpdateUserDto): Promise<UserEntity>;
}

export class UpdateUserUserCase implements UpdateUser {
  constructor(private readonly repository: UserRepository) {}

  execute(dto: UpdateUserDto): Promise<UserEntity> {
    return this.repository.update(dto);
  }
}
