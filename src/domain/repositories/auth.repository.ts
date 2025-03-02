import { LoginDto } from "../dtos/auth/login.dto";
import { LogoutDto } from "../dtos/auth/logout.dto";
import { RegisterDto } from "../dtos/auth/register.dto";
import { AuthEntity } from "../entities/auth.entity";

export abstract class AuthRepository {
  abstract register(dto: RegisterDto): Promise<AuthEntity>;
  abstract login(dto: LoginDto): Promise<AuthEntity>;
  abstract logout(dto: LogoutDto): Promise<void>;
}
