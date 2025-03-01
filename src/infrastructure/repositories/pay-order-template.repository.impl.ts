import {
  CreatePayOrderTemplateDto,
  UpdatePayOrderTemplateDto,
} from "@/domain/dtos";
import { PayOrderTemplateEntity } from "@/domain/entities";
import { PayOrderTemplateRepository } from "@/domain/repositories/pay-order-template.repository";
import { PayOrderTemplateDatasource } from "../../domain/datasources/pay-order-template.datasource";

export class PayOrderTemplateRepositoryImpl
  implements PayOrderTemplateRepository
{
  constructor(private readonly datasource: PayOrderTemplateDatasource) {}

  create(dto: CreatePayOrderTemplateDto): Promise<PayOrderTemplateEntity> {
    return this.datasource.create(dto);
  }

  update(dto: UpdatePayOrderTemplateDto): Promise<PayOrderTemplateEntity> {
    return this.datasource.update(dto);
  }

  getAll(): Promise<PayOrderTemplateEntity> {
    return this.datasource.getAll();
  }

  getById(id: string): Promise<PayOrderTemplateEntity> {
    return this.datasource.deleteById(id);
  }

  deleteById(id: string): Promise<PayOrderTemplateEntity> {
    return this.datasource.getById(id);
  }
}
