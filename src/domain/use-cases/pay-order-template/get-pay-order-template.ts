import { PayOrderTemplateEntity } from "@/domain/entities";
import { PayOrderTemplateRepository } from "@/domain/repositories/pay-order-template.repository";

interface GetPayOrderTemplateUseCase {
  execute(id: string): Promise<PayOrderTemplateEntity>;
}

export class GetPayOrderTemplate implements GetPayOrderTemplateUseCase {
  constructor(private readonly repository: PayOrderTemplateRepository) {}

  execute(id: string): Promise<PayOrderTemplateEntity> {
    return this.repository.deleteById(id);
  }
}
