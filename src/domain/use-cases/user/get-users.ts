import { UserEntity } from "@/domain/entities";
import { UserRepository } from "@/domain/repositories";

interface GetUsersUseCase {
  execute(): Promise<UserEntity[]>;
}

export class GetUsers implements GetUsersUseCase {
  constructor(private readonly repository: UserRepository) {}

  execute(): Promise<UserEntity[]> {
    return this.repository.getAll();
  }
}
