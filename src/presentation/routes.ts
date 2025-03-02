import { Router } from "express";
import { UsersRoutes } from "./users/routes";
import { PayOrderTemplateRoutes } from "./pay-order-template/routes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use("/api/users", UsersRoutes.routes);
    router.use("/api/payorder", PayOrderTemplateRoutes.routes);

    return router;
  }
}
