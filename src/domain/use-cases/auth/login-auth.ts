import { AuthDatasource } from "@/domain/datasources/auth.datasource";
import { LoginDto } from "@/domain/dtos/auth/login.dto";
import { AuthEntity } from "@/domain/entities/auth.entity";

interface LoginAuthUseCase {
  execute(dto: LoginDto): Promise<AuthEntity>;
}

export class LoginAuth implements LoginAuthUseCase {
  constructor(private readonly datasource: AuthDatasource) {}

  execute(dto: LoginDto): Promise<AuthEntity> {
    return this.datasource.login(dto);
  }
}
