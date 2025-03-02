import { RegisterDto } from "@/domain/dtos/auth/register.dto";
import { CreateUserDto } from "../../dtos/user/create-user.dto";
import { UserEntity } from "@/domain/entities";
import { AuthRepository } from "../../repositories/auth.repository";
import { UserRepository } from "@/domain/repositories";

interface SaveUserUseCase {
  execute(
    registerDto: RegisterDto,
    createUserDto: CreateUserDto
  ): Promise<UserEntity>;
}

// export class SaveUser implements  SaveUserUseCase{
//   constructor(
//     private readonly authRepository: AuthRepository,
//     private readonly userRepository: UserRepository
//   ) {}

//   async execute(registerDto: RegisterDto, createUserDto: CreateUserDto): Promise<UserEntity> {

//     const authEntity = await this.authRepository.register(registerDto);

//     return
//   }

// }
