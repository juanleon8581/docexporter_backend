import { prisma } from "@/data/postgres";
import { PayOrderTemplateDatasource } from "@/domain/datasources";
import {
  CreatePayOrderTemplateDto,
  UpdatePayOrderTemplateDto,
} from "@/domain/dtos";
import { PayOrderTemplateEntity } from "@/domain/entities";

export class PayOrderTemplateDatasourceImpl
  implements PayOrderTemplateDatasource
{
  async create(
    dto: CreatePayOrderTemplateDto
  ): Promise<PayOrderTemplateEntity> {
    const newPayOrderTemplate = await prisma.payOrderTemplate.create({
      data: dto,
    });

    return PayOrderTemplateEntity.fromJson(newPayOrderTemplate);
  }

  async getAll(): Promise<PayOrderTemplateEntity[]> {
    const allPayOrderTemplates = await prisma.payOrderTemplate.findMany();

    return allPayOrderTemplates.map((template) =>
      PayOrderTemplateEntity.fromJson(template)
    );
  }

  async getById(id: string): Promise<PayOrderTemplateEntity> {
    const payOrderTemplate = await prisma.payOrderTemplate.findUnique({
      where: {
        id,
        deleted: false,
      },
    });

    if (!payOrderTemplate) throw "Template no found";

    return PayOrderTemplateEntity.fromJson(payOrderTemplate);
  }

  async update(
    dto: UpdatePayOrderTemplateDto
  ): Promise<PayOrderTemplateEntity> {
    const { id } = dto;
    await this.getById(id);

    const updatedPayOrderTemplate = await prisma.payOrderTemplate.update({
      where: {
        id,
      },
      data: dto,
    });

    return PayOrderTemplateEntity.fromJson(updatedPayOrderTemplate);
  }

  async deleteById(id: string): Promise<PayOrderTemplateEntity> {
    await this.getById(id);

    const payOrderDeleted = await prisma.payOrderTemplate.update({
      where: {
        id,
      },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
    });

    return PayOrderTemplateEntity.fromJson(payOrderDeleted);
  }
}
