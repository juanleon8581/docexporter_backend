import { LoginDto } from "../dtos/auth/login.dto";
import { LogoutDto } from "../dtos/auth/logout.dto";
import { RegisterDto } from "../dtos/auth/register.dto";
import { UserEntity } from "../entities";

export abstract class AuthDatasource {
  abstract register(dto: RegisterDto): Promise<UserEntity>;
  abstract login(dto: LoginDto): Promise<{ user: UserEntity; token: string }>;
  abstract logout(dto: LogoutDto): Promise<void>;
}
