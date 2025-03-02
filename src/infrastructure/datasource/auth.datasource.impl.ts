import { createClient } from "@supabase/supabase-js";
import { AuthDatasource } from "@/domain/datasources/auth.datasource";
import { LoginDto } from "@/domain/dtos/auth/login.dto";
import { LogoutDto } from "@/domain/dtos/auth/logout.dto";
import { RegisterDto } from "@/domain/dtos/auth/register.dto";
import { AuthEntity } from "@/domain/entities/auth.entity";

import envs from "@/config/envs";

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

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error("No user returned from Supabase");

    return AuthEntity.fromJson({
      id: data.user.id,
      email: data.user.email,
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
    });
  }

  async login(dto: LoginDto): Promise<AuthEntity> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    if (error) throw new Error(error.message);
    if (!data.user || !data.session) throw new Error("Invalid login response");

    return AuthEntity.fromJson({
      id: data.user.id,
      email: data.user.email,
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    });
  }

  async logout(dto: LogoutDto): Promise<void> {
    const { error } = await this.supabase.auth.signOut({
      scope: "global",
    });

    if (error) throw new Error(error.message);
  }
}
