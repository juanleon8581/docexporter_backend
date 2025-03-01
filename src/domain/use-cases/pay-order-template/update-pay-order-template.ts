import { UpdatePayOrderTemplateDto } from "@/domain/dtos";
import { PayOrderTemplateEntity } from "@/domain/entities";
import { PayOrderTemplateRepository } from "@/domain/repositories/pay-order-template.repository";

interface UpdatePayOrderTemplateUseCase {
  execute(dto: UpdatePayOrderTemplateDto): Promise<PayOrderTemplateEntity>;
}

export class UpdatePayOrderTemplate implements UpdatePayOrderTemplateUseCase {
  constructor(private readonly repository: PayOrderTemplateRepository) {}

  execute(dto: UpdatePayOrderTemplateDto): Promise<PayOrderTemplateEntity> {
    return this.repository.update(dto);
  }
}
