import { AuthDatasource } from "@/domain/datasources/auth.datasource";
import { RegisterDto } from "@/domain/dtos/auth/register.dto";
import { AuthEntity } from "@/domain/entities/auth.entity";

interface RegisterAuthUseCase {
  execute(dto: RegisterDto): Promise<AuthEntity>;
}

export class RegisterAuth implements RegisterAuthUseCase {
  constructor(private readonly datasource: AuthDatasource) {}

  execute(dto: RegisterDto): Promise<AuthEntity> {
    return this.datasource.register(dto);
  }
}
