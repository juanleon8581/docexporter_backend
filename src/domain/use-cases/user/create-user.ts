import { RegisterDto } from "@/domain/dtos/auth/register.dto";
import { CreateUserDto } from "../../dtos/user/create-user.dto";
import { UserEntity } from "@/domain/entities";
import { AuthRepository } from "../../repositories/auth.repository";
import { UserRepository } from "@/domain/repositories";

interface CreateUserUseCase {
  execute(registerDto: RegisterDto): Promise<UserEntity>;
}

export class CreateUser implements CreateUserUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(registerDto: RegisterDto): Promise<UserEntity> {
    const authEntity = await this.authRepository.register(registerDto);
    const createUserDto: CreateUserDto = {
      authId: authEntity.id,
      name: authEntity.name,
      lastname: authEntity.lastname,
    };

    return this.userRepository.create(createUserDto);
  }
}
