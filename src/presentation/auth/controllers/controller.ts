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

  /**
   * @openapi
   * /api/auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: John
   *               lastname:
   *                 type: string
   *                 example: Doe
   *               email:
   *                 type: string
   *                 example: john.doe@example.com
   *               password:
   *                 type: string
   *                 example: password123
   *             required:
   *               - name
   *               - lastname
   *               - email
   *               - password
   *     responses:
   *       200:
   *         description: User registered successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                     email:
   *                       type: string
   *                     name:
   *                       type: string
   *                     lastname:
   *                       type: string
   *                     accessToken:
   *                       type: string
   *                     refreshToken:
   *                       type: string
   *                     createdAt:
   *                       type: string
   *       400:
   *         description: Invalid data provided
   *         content:
   *            application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   */
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

  /**
   * @openapi
   * /api/auth/login:
   *   post:
   *     summary: Login a user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 example: john.doe@example.com
   *               password:
   *                 type: string
   *                 example: password123
   *             required:
   *               - email
   *               - password
   *     responses:
   *       200:
   *         description: User logged in successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                 email:
   *                   type: string
   *                 name:
   *                   type: string
   *                 lastname:
   *                   type: string
   *                 accessToken:
   *                   type: string
   *                 refreshToken:
   *                   type: string
   *       400:
   *         description: Invalid credentials
   */
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

  /**
   * @openapi
   * /api/auth/logout:
   *   post:
   *     summary: Logout a user
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               accessToken:
   *                 type: string
   *                 example: your_jwt_token
   *             required:
   *               - accessToken
   *     responses:
   *       204:
   *         description: User logged out successfully
   *       400:
   *         description: Invalid token
   */
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
