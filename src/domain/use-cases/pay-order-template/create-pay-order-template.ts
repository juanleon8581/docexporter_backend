import { CreatePayOrderTemplateDto } from "@/domain/dtos";
import { PayOrderTemplateEntity } from "@/domain/entities";
import { PayOrderTemplateRepository } from "@/domain/repositories/pay-order-template.repository";

interface CreatePayOrderTemplateUseCase {
  execute(dto: CreatePayOrderTemplateDto): Promise<PayOrderTemplateEntity>;
}

export class CreatePayOrder implements CreatePayOrderTemplateUseCase {
  constructor(private readonly repository: PayOrderTemplateRepository) {}

  execute(dto: CreatePayOrderTemplateDto): Promise<PayOrderTemplateEntity> {
    return this.repository.create(dto);
  }
}
