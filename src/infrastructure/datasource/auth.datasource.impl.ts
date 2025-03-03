import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/data/postgres";
import { AuthDatasource } from "@/domain/datasources/auth.datasource";
import { LoginDto } from "@/domain/dtos/auth/login.dto";
import { LogoutDto } from "@/domain/dtos/auth/logout.dto";
import { RegisterDto } from "@/domain/dtos/auth/register.dto";
import { AuthEntity } from "@/domain/entities/auth.entity";

import envs from "@/config/envs";
import { NotFoundError } from "@/errors/not-found-error";
import { BadRequestError } from "@/errors/bad-request-error";
import { UnauthorizedError } from "@/errors/unauthorized-error";

export class AuthDatasourceImpl implements AuthDatasource {
  private readonly supabase;

  constructor() {
    this.supabase = createClient(envs.SUPABASE_URL, envs.SUPABASE_KEY);
  }

  async register(dto: RegisterDto): Promise<AuthEntity> {
    const { data, error } = await this.supabase.auth.signUp({
      email: dto.email,
      password: dto.password,
    });

    if (error) throw new BadRequestError(error.message);
    if (!data.user) throw new NotFoundError("Invalid User");

    return AuthEntity.fromJson({
      id: data.user.id,
      email: data.user.email,
      name: dto.name,
      lastname: dto.lastname,
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
    });
  }

  async login(dto: LoginDto): Promise<AuthEntity> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    if (error) throw new BadRequestError(error.message);
    if (!data.user || !data.session)
      throw new NotFoundError("Invalid User or Password");

    const dbUser = await prisma.user.findUnique({
      where: {
        authId: data.user.id,
        deleted: false,
      },
    });
    if (!dbUser) throw new NotFoundError("Invalid User or Password");

    return AuthEntity.fromJson({
      id: data.user.id,
      email: data.user.email,
      name: dbUser.name,
      lastname: dbUser.lastname,
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    });
  }

  async logout(dto: LogoutDto): Promise<void> {
    const { error } = await this.supabase.auth.signOut({
      scope: "global",
    });

    if (error) throw new UnauthorizedError(error.message);
  }
}
