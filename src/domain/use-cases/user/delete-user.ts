import { UserEntity } from "@/domain/entities";
import { UserRepository } from "@/domain/repositories";

export interface DeleteUserUseCase {
  execute(id: string): Promise<UserEntity>;
}

export class DeleteUserUseCase implements DeleteUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  execute(id: string): Promise<UserEntity> {
    return this.repository.deleteById(id);
  }
}
