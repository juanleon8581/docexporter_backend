import { Request, Response } from "express";
import { Router } from "express";
import { PayOrderTemplateController } from "./controller";
import { PayOrderTemplateRepositoryImpl } from "@/infrastructure/repositories/pay-order-template.repository.impl";
import { PayOrderTemplateDatasourceImpl } from "@/infrastructure/datasource/pay-order-template.datasource.impl";

export class PayOrderTemplateRoutes {
  static get routes(): Router {
    const router = Router();

    const dataSource = new PayOrderTemplateDatasourceImpl();
    const repository = new PayOrderTemplateRepositoryImpl(dataSource);
    const controller = new PayOrderTemplateController(repository);

    router.post("/", (req: Request, res: Response) => {
      controller.createPayOrderTemplate(req, res);
    });

    router.get("/", controller.getPayOrderTemplates);
    router.get("/:id", controller.getPayOrderTemplate);

    router.put("/", (req: Request, res: Response) => {
      controller.updatePayOrderTemplate(req, res);
    });

    router.delete("/:id", controller.deletePayOrderTemplate);

    return router;
  }
}
