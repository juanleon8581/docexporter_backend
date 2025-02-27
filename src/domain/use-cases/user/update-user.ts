import { UpdateUserDto } from "@/domain/dtos";
import { UserEntity } from "@/domain/entities";
import { UserRepository } from "@/domain/repositories";

interface UpdateUserUserCase {
  execute(dto: UpdateUserDto): Promise<UserEntity>;
}

export class UpdateUser implements UpdateUserUserCase {
  constructor(private readonly repository: UserRepository) {}

  execute(dto: UpdateUserDto): Promise<UserEntity> {
    return this.repository.update(dto);
  }
}
