import { Request, Response, Router } from "express";
import { UserController } from "@/presentation/users/controller";
import { UserDatasourceImpl } from "@/infrastructure/datasource/user.datasource.impl";
import { UserRepositoryImpl } from "@/infrastructure/repositories/user.repository.impl";
import { AuthDatasourceImpl } from "@/infrastructure/datasource/auth.datasource.impl";
import { AuthRepositoryImpl } from "@/infrastructure/repositories/auth.repository.impl";

export class UsersRoutes {
  static get routes(): Router {
    const router = Router();

    const userDatasource = new UserDatasourceImpl();
    const userRepository = new UserRepositoryImpl(userDatasource);
    const authDatasource = new AuthDatasourceImpl();
    const authRepository = new AuthRepositoryImpl(authDatasource);
    const userController = new UserController(authRepository, userRepository);

    router.post("/", (req: Request, res: Response) => {
      userController.createUser(req, res);
    });

    router.get("/", userController.getUsers);
    router.get("/:id", userController.getUserById);

    router.put("/", (req: Request, res: Response) => {
      userController.updateUser(req, res);
    });

    router.delete("/:id", userController.deleteUser);

    return router;
  }
}
