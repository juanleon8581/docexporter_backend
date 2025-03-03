import { Request, Response, Router } from "express";
import { AuthController } from "./controllers/controller";
import { AuthDatasourceImpl } from "@/infrastructure/datasource/auth.datasource.impl";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    const datasource = new AuthDatasourceImpl();
    const controller = new AuthController(datasource);

    router.post("/register", (req: Request, res: Response) => {
      controller.register(req, res);
    });
    router.post("/login", (req: Request, res: Response) => {
      controller.login(req, res);
    });
    router.post("/logout", (req: Request, res: Response) => {
      controller.logout(req, res);
    });

    return router;
  }
}
