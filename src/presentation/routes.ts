import { Router } from "express";
import { UsersRoutes } from "./users/routes/routes";
import { PayOrderTemplateRoutes } from "./pay-order-template/routes";
import { AuthRoutes } from "./auth/routes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use("/api/users", UsersRoutes.routes);
    router.use("/api/auth", AuthRoutes.routes);
    router.use("/api/payorder", PayOrderTemplateRoutes.routes);

    return router;
  }
}
