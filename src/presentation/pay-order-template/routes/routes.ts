import { Request, Response, Router } from "express";
import { PayOrderTemplateController } from "./controllers/controller";
import { PayOrderTemplateRepositoryImpl } from "@/infrastructure/repositories/pay-order-template.repository.impl";
import { PayOrderTemplateDatasourceImpl } from "@/infrastructure/datasource/pay-order-template.datasource.impl";
import { AuthMiddleware } from "../middleware/auth.middleware";

export class PayOrderTemplateRoutes {
  static get routes(): Router {
    const router = Router();

    const dataSource = new PayOrderTemplateDatasourceImpl();
    const repository = new PayOrderTemplateRepositoryImpl(dataSource);
    const controller = new PayOrderTemplateController(repository);

    router.post("/", (req: Request, res: Response) => {
      controller.createPayOrderTemplate(req, res);
    });

    router.get(
      "/",
      [AuthMiddleware.validateJWT],
      controller.getPayOrderTemplates
    );
    router.get("/:id", controller.getPayOrderTemplate);

    router.put("/", (req: Request, res: Response) => {
      controller.updatePayOrderTemplate(req, res);
    });

    router.delete("/:id", controller.deletePayOrderTemplate);

    return router;
  }
}
