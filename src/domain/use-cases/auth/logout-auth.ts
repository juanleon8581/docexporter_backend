import { AuthDatasource } from "@/domain/datasources/auth.datasource";
import { LogoutDto } from "@/domain/dtos/auth/logout.dto";

interface LogoutAuthUseCase {
  execute(dto: LogoutDto): Promise<void>;
}

export class LogoutAuth implements LogoutAuthUseCase {
  constructor(private readonly datasource: AuthDatasource) {}

  execute(dto: LogoutDto): Promise<void> {
    return this.datasource.logout(dto);
  }
}
