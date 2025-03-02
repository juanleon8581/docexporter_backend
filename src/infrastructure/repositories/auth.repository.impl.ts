import { AuthDatasource } from "@/domain/datasources/auth.datasource";
import { LoginDto } from "@/domain/dtos/auth/login.dto";
import { LogoutDto } from "@/domain/dtos/auth/logout.dto";
import { RegisterDto } from "@/domain/dtos/auth/register.dto";
import { AuthEntity } from "@/domain/entities/auth.entity";
import { AuthRepository } from "@/domain/repositories/auth.repository";

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly datasource: AuthDatasource) {}

  register(dto: RegisterDto): Promise<AuthEntity> {
    return this.datasource.register(dto);
  }

  login(dto: LoginDto): Promise<AuthEntity> {
    return this.datasource.login(dto);
  }

  logout(dto: LogoutDto): Promise<void> {
    return this.datasource.logout(dto);
  }
}
