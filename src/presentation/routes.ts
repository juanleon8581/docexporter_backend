import { Router } from "express";
import { UsersRoutes } from "./users/routes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use("/api/todos", UsersRoutes.routes);

    return router;
  }
}
