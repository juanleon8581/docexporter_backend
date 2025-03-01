import { Request, Response, Router } from "express";
import { UserController } from "@/presentation/users/controller";
import { UserDatasourceImpl } from "@/infrastructure/datadasource/user.datasource.impl";
import { UserRepositoryImpl } from "@/infrastructure/repositories/user.repository.impl";

export class UsersRoutes {
  static get routes(): Router {
    const router = Router();

    const userDatasource = new UserDatasourceImpl();
    const userRepository = new UserRepositoryImpl(userDatasource);
    const userController = new UserController(userRepository);

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
