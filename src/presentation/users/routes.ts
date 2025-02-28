import { Request, Response, Router } from "express";

export class UsersRoutes {
  static get routes(): Router {
    const router = Router();

    router.get("/", (req: Request, res: Response) => {
      res.json({
        data: "implementing...",
      });
    });
    return router;
  }
}
