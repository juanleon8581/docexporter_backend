import { PayOrderTemplateEntity } from "@/domain/entities";
import { PayOrderTemplateRepository } from "@/domain/repositories/pay-order-template.repository";

interface GetPayOrderTemplatesUseCase {
  execute(): Promise<PayOrderTemplateEntity[]>;
}

export class PayOrderTemplate implements GetPayOrderTemplatesUseCase {
  constructor(private readonly repository: PayOrderTemplateRepository) {}

  execute(): Promise<PayOrderTemplateEntity[]> {
    return this.repository.getAll();
  }
}
