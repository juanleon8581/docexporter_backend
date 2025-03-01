import { CreatePayOrderTemplateDto, UpdatePayOrderTemplateDto } from "../dtos";
import { PayOrderTemplateEntity } from "../entities";

export abstract class PayOrderTemplateRepository {
  abstract create(
    dto: CreatePayOrderTemplateDto
  ): Promise<PayOrderTemplateEntity>;
  abstract update(
    dto: UpdatePayOrderTemplateDto
  ): Promise<PayOrderTemplateEntity>;
  abstract getAll(): Promise<PayOrderTemplateEntity>;
  abstract getById(id: string): Promise<PayOrderTemplateEntity>;
  abstract deleteById(id: string): Promise<PayOrderTemplateEntity>;
}
