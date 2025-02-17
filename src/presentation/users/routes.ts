import { Router } from "express";

export class UsersRoutes {
  static get routes(): Router {
    const router = Router();

    router.get("/", () => {});
    return router;
  }
}
