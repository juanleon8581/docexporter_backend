import { Request, Response, Router } from "express";
import { PayOrderTemplateRepositoryImpl } from "@/infrastructure/repositories/pay-order-template.repository.impl";
import { PayOrderTemplateDatasourceImpl } from "@/infrastructure/datasource/pay-order-template.datasource.impl";
import { PayOrderTemplateController } from "../controllers/controller";
import { AuthMiddleware } from "@/middleware/auth.middleware";

export class PayOrderTemplateRoutes {
  static get routes(): Router {
    const router = Router();

    const dataSource = new PayOrderTemplateDatasourceImpl();
    const repository = new PayOrderTemplateRepositoryImpl(dataSource);
    const controller = new PayOrderTemplateController(repository);

    router.use(AuthMiddleware.validateJWT);

    router.post("/", controller.createPayOrderTemplate);

    router.get("/", controller.getPayOrderTemplates);
    router.get("/:id", controller.getPayOrderTemplate);

    router.put("/", controller.updatePayOrderTemplate);

    router.delete("/:id", controller.deletePayOrderTemplate);

    return router;
  }
}
