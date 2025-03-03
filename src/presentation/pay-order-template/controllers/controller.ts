import { Request, Response } from "express";
import {
  CreatePayOrderTemplateDto,
  UpdatePayOrderTemplateDto,
} from "@/domain/dtos";
import { PayOrderTemplateRepository } from "@/domain/repositories/pay-order-template.repository";
import { CreatePayOrder } from "@/domain/use-cases/pay-order-template/create-pay-order-template";
import { GetPayOrderTemplate } from "@/domain/use-cases/pay-order-template/get-pay-order-template";
import { GetPayOrderTemplates } from "@/domain/use-cases/pay-order-template/get-pay-order-templates";
import { UpdatePayOrderTemplate } from "@/domain/use-cases/pay-order-template/update-pay-order-template";
import { DeletePayOrderTemplate } from "@/domain/use-cases/pay-order-template/delete-pay-order-template";

export class PayOrderTemplateController {
  constructor(
    private readonly payOrderTemplateRepository: PayOrderTemplateRepository
  ) {}

  public createPayOrderTemplate = (req: Request, res: Response) => {
    const [error, createPayOrderTemplateDto] = CreatePayOrderTemplateDto.create(
      req.body
    );

    if (error) {
      res.status(400).json({ error });
      return;
    }

    new CreatePayOrder(this.payOrderTemplateRepository)
      .execute(createPayOrderTemplateDto!)
      .then((template) => res.json(template))
      .catch((error) => res.status(400).json(error));
  };

  public getPayOrderTemplates = (req: Request, res: Response) => {
    new GetPayOrderTemplates(this.payOrderTemplateRepository)
      .execute()
      .then((template) => res.json(template))
      .catch((error) => res.status(400).json(error));
  };

  public getPayOrderTemplate = (req: Request, res: Response) => {
    const { id } = req.params;

    new GetPayOrderTemplate(this.payOrderTemplateRepository)
      .execute(id)
      .then((template) => res.json(template))
      .catch((error) => res.status(400).json(error));
  };

  public updatePayOrderTemplate = (req: Request, res: Response) => {
    const [error, updatePayOrderTemplateDto] = UpdatePayOrderTemplateDto.create(
      req.body
    );

    if (error) {
      res.status(400).json({ error });
      return;
    }

    new UpdatePayOrderTemplate(this.payOrderTemplateRepository)
      .execute(updatePayOrderTemplateDto!)
      .then((template) => res.json(template))
      .catch((error) => res.status(400).json(error));
  };

  public deletePayOrderTemplate = (req: Request, res: Response) => {
    const { id } = req.params;

    new DeletePayOrderTemplate(this.payOrderTemplateRepository)
      .execute(id)
      .then((template) => res.json(template))
      .catch((error) => res.status(400).json(error));
  };
}
