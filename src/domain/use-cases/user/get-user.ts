import { UserEntity } from "@/domain/entities";
import { UserRepository } from "@/domain/repositories";

export interface GetUser {
  execute(id: string): Promise<UserEntity>;
}

export class GetUserUseCase implements GetUser {
  constructor(private readonly repository: UserRepository) {}
  execute(id: string): Promise<UserEntity> {
    return this.repository.getById(id);
  }
}
