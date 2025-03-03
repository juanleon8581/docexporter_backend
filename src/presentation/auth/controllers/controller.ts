import { AuthDatasource } from "@/domain/datasources/auth.datasource";
import { LoginDto } from "@/domain/dtos/auth/login.dto";
import { LogoutDto } from "@/domain/dtos/auth/logout.dto";
import { RegisterDto } from "@/domain/dtos/auth/register.dto";
import { AuthRepository } from "@/domain/repositories/auth.repository";
import { LoginAuth } from "@/domain/use-cases/auth/login-auth";
import { LogoutAuth } from "@/domain/use-cases/auth/logout-auth";
import { RegisterAuth } from "@/domain/use-cases/auth/register-auth";
import { Request, Response } from "express";

export class AuthController {
  constructor(private readonly repository: AuthRepository) {}

  public register = (req: Request, res: Response) => {
    const [error, registerDto] = RegisterDto.create(req.body);
    if (error) {
      res.status(400).json({ error });
      return;
    }

    new RegisterAuth(this.repository)
      .execute(registerDto!)
      .then((auth) => res.json(auth))
      .catch((error) => res.status(400).json({ error: error.message }));
  };

  public login = (req: Request, res: Response) => {
    const [error, loginDto] = LoginDto.create(req.body);
    if (error) {
      res.status(400).json({ error });
      return;
    }

    new LoginAuth(this.repository)
      .execute(loginDto!)
      .then((auth) => res.json(auth))
      .catch((error) => res.status(400).json({ error: error.message }));
  };

  public logout = (req: Request, res: Response) => {
    const [error, logoutDto] = LogoutDto.create({
      accessToken: req.headers.authorization?.split(" ")[1],
    });
    if (error) {
      res.status(400).json({ error });
      return;
    }

    new LogoutAuth(this.repository)
      .execute(logoutDto!)
      .then(() => res.status(204).send())
      .catch((error) => res.status(400).json({ error: error.message }));
  };
}
