import { UserEntity } from "@/domain/entities";
import { UserRepository } from "@/domain/repositories";

interface GetUserUseCase {
  execute(id: string): Promise<UserEntity>;
}

export class GetUser implements GetUserUseCase {
  constructor(private readonly repository: UserRepository) {}
  execute(id: string): Promise<UserEntity> {
    return this.repository.getById(id);
  }
}
