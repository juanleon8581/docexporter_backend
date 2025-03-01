import { PayOrderTemplateEntity } from "@/domain/entities";
import { PayOrderTemplateRepository } from "@/domain/repositories/pay-order-template.repository";

interface DeletePayOrderTemplateUseCase {
  execute(id: string): Promise<PayOrderTemplateEntity>;
}

export class DeletePayOrderTemplate implements DeletePayOrderTemplateUseCase {
  constructor(private readonly repository: PayOrderTemplateRepository) {}
  execute(id: string): Promise<PayOrderTemplateEntity> {
    return this.repository.deleteById(id);
  }
}
