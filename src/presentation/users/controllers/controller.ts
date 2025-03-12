import { Request, Response } from "express";
import { UserRepository } from "@/domain/repositories";
import { UpdateUserDto } from "@/domain/dtos";
import {
  CreateUser,
  DeleteUser,
  GetUser,
  GetUsers,
  UpdateUser,
} from "@/domain/use-cases";
import { RegisterDto } from "@/domain/dtos/auth/register.dto";
import { AuthRepository } from "@/domain/repositories/auth.repository";

export class UserController {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository
  ) {}

  /**
   * @openapi
   * /api/users/:
   *   post:
   *     summary: create a user in own batabase
   *     tags: [User]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: "Joe"
   *                 description: "Name of the user"
   *               lastname:
   *                 type: string
   *                 example: "Doe"
   *                 description: "Lastname of the user"
   *               email:
   *                 type: string
   *                 example: "aa@test.com"
   *                 description: "Email of the user"
   *               password:
   *                 type: string
   *                 example: "12345678"
   *                 description: "Password of the user must be 8 characters long or more"
   *             required:
   *               - name
   *               - lastname
   *               - email
   *               - password
   *     responses:
   *       200:
   *         description: Successful operation
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   example: "resource123"
   *                 field1:
   *                   type: string
   *                   example: "exampleValue1"
   *       400:
   *         description: Bad request due to invalid data
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Invalid Data"
   *       401:
   *         description: Unauthorized access
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Unauthorized"
   *       404:
   *         description: Resource not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Resource not found"
   */
  public createUser = (req: Request, res: Response) => {
    const [error, registerDto] = RegisterDto.create(req.body);

    if (error) {
      res.status(400).json({ error });
      return;
    }

    new CreateUser(this.authRepository, this.userRepository)
      .execute(registerDto!)
      .then((user) => res.json(user))
      .catch((error) => res.status(400).json(error));
  };

  public getUsers = (req: Request, res: Response) => {
    new GetUsers(this.userRepository)
      .execute()
      .then((users) => res.json(users))
      .catch((error) => res.status(400).json(error));
  };

  public getUserById = (req: Request, res: Response) => {
    const { id } = req.params;

    new GetUser(this.userRepository)
      .execute(id)
      .then((user) => res.json(user))
      .catch((error) => res.status(400).json(error));
  };

  public updateUser = (req: Request, res: Response) => {
    const [error, updateUserDto] = UpdateUserDto.create(req.body);
    if (error) {
      res.status(400).json(error);
      return;
    }

    new UpdateUser(this.userRepository)
      .execute(updateUserDto!)
      .then((user) => res.json(user))
      .catch((error) => res.status(400).json(error));
  };
  public deleteUser = (req: Request, res: Response) => {
    const { id } = req.params;

    new DeleteUser(this.userRepository)
      .execute(id)
      .then((user) => res.json(user))
      .catch((error) => res.status(400).json(error));
  };
}
