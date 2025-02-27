import { UserEntity } from "@/domain/entities";
import { UserRepository } from "@/domain/repositories";

interface DeleteUserUseCase {
  execute(id: string): Promise<UserEntity>;
}

export class DeleteUser implements DeleteUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  execute(id: string): Promise<UserEntity> {
    return this.repository.deleteById(id);
  }
}
