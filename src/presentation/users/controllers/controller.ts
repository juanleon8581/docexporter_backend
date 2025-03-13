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
   * /api/users/create:
   *   post:
   *     summary: create a user in own database
   *     tags: [User, Auth]
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
   *                   example: "user12345"
   *                 authId:
   *                   type: string
   *                   example: "authUserId123"
   *                 name:
   *                   type: string
   *                   example: "joe"
   *                 lastname:
   *                   type: string
   *                   example: "doe"
   *                 createdAt:
   *                   type: string
   *                   example: "2025-03-13T00:57:49.370Z"
   *                 updatedAt:
   *                   type: string
   *                   example: "2025-03-13T00:57:49.370Z"
   *                 deleted:
   *                   type: boolean
   *                   example: false
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

  /**
   * @openapi
   * /api/users:
   *   get:
   *     summary: Get all users
   *     tags: [User]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of all users
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                     example: "user123"
   *                   name:
   *                     type: string
   *                     example: "Joe"
   *                   lastname:
   *                     type: string
   *                     example: "Doe"
   *                   email:
   *                     type: string
   *                     example: "joe.doe@example.com"
   *       400:
   *         description: Bad request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Error fetching users"
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
   */
  public getUsers = (req: Request, res: Response) => {
    new GetUsers(this.userRepository)
      .execute()
      .then((users) => res.json(users))
      .catch((error) => res.status(400).json(error));
  };

  /**
   * @openapi
   * /api/users/{id}:
   *   get:
   *     summary: Get user by ID
   *     tags: [User]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: User ID
   *     responses:
   *       200:
   *         description: User details
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   example: "user123"
   *                 authId:
   *                   type: string
   *                   example: "userAuthId1234"
   *                 name:
   *                   type: string
   *                   example: "Joe"
   *                 lastname:
   *                   type: string
   *                   example: "Doe"
   *                 createdAt:
   *                   type: string
   *                   example: "2025-03-13T00:57:49.370Z"
   *                 updatedAt:
   *                   type: string
   *                   example: "2025-03-13T00:57:49.370Z"
   *                 deleted:
   *                   type: boolean
   *                   example: false
   *       400:
   *         description: Bad request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Error fetching user"
   */
  public getUserById = (req: Request, res: Response) => {
    const { id } = req.params;

    new GetUser(this.userRepository)
      .execute(id)
      .then((user) => res.json(user))
      .catch((error) => res.status(400).json(error));
  };

  /**
   * @openapi
   * /api/users:
   *   patch:
   *     summary: Update user information
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
   *               id:
   *                 type: string
   *                 example: "user123"
   *                 description: "ID of the user to update"
   *               name:
   *                 type: string
   *                 example: "Joe Updated"
   *                 description: "Updated name of the user"
   *               lastname:
   *                 type: string
   *                 example: "Doe Updated"
   *                 description: "Updated lastname of the user"
   *             required:
   *               - id
   *     responses:
   *       200:
   *         description: Updated user information
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   example: "user123"
   *                 name:
   *                   type: string
   *                   example: "Joe"
   *                 lastname:
   *                   type: string
   *                   example: "Doe"
   *                 createdAt:
   *                   type: string
   *                   example: "2025-03-13T00:57:49.370Z"
   *                 updatedAt:
   *                   type: string
   *                   example: "2025-03-13T00:57:49.370Z"
   *                 deleted:
   *                   type: boolean
   *                   example: false
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
   */
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
  /**
   * @openapi
   * /api/users/{id}:
   *   delete:
   *     summary: Delete a user
   *     tags: [User]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: User ID to delete
   *     responses:
   *       200:
   *         description: User deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   example: "user123"
   *                 authId:
   *                   type: string
   *                   example: "userAuthId1234"
   *                 name:
   *                   type: string
   *                   example: "Joe"
   *                 lastname:
   *                   type: string
   *                   example: "Doe"
   *                 createdAt:
   *                   type: string
   *                   example: "2025-03-13T00:57:49.370Z"
   *                 updatedAt:
   *                   type: string
   *                   example: "2025-03-13T00:57:49.370Z"
   *                 deleted:
   *                   type: boolean
   *                   example: true"
   */
  public deleteUser = (req: Request, res: Response) => {
    const { id } = req.params;

    new DeleteUser(this.userRepository)
      .execute(id)
      .then((user) => res.json(user))
      .catch((error) => res.status(400).json(error));
  };
}
