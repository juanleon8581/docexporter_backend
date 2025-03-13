import { Request, Response, Router } from "express";
import { AuthController } from "../controllers/controller";
import { AuthDatasourceImpl } from "@/infrastructure/datasource/auth.datasource.impl";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    const datasource = new AuthDatasourceImpl();
    const controller = new AuthController(datasource);

    router.post("/login", controller.login);
    router.post("/logout", controller.logout);

    return router;
  }
}
