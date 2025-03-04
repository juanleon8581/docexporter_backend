import { prisma } from "@/data/postgres";
import { PayOrderTemplateDatasource } from "@/domain/datasources";
import {
  CreatePayOrderTemplateDto,
  UpdatePayOrderTemplateDto,
} from "@/domain/dtos";
import { PayOrderTemplateEntity } from "@/domain/entities";
import { NotFoundError } from "@/errors/not-found-error";
import { CryptoAdapter } from "@/config/adapters/crypto.adapter";

type EncryptDataDto = CreatePayOrderTemplateDto | UpdatePayOrderTemplateDto;

export class PayOrderTemplateDatasourceImpl
  implements PayOrderTemplateDatasource
{
  private encryptSensitiveData(dto: EncryptDataDto): EncryptDataDto {
    const encryptedDto = { ...dto };
    if (dto.dni) encryptedDto.dni = CryptoAdapter.encrypt(dto.dni);
    if (dto.bank) encryptedDto.bank = CryptoAdapter.encrypt(dto.bank);
    if (dto.accountNumber)
      encryptedDto.accountNumber = CryptoAdapter.encrypt(dto.accountNumber);
    return encryptedDto;
  }

  private decryptSensitiveData(template: {
    [key: string]: any;
  }): PayOrderTemplateEntity {
    const decryptedTemplate = { ...template };
    if (template.dni)
      decryptedTemplate.dni = CryptoAdapter.decrypt(template.dni);
    if (template.bank)
      decryptedTemplate.bank = CryptoAdapter.decrypt(template.bank);
    if (template.accountNumber)
      decryptedTemplate.accountNumber = CryptoAdapter.decrypt(
        template.accountNumber
      );
    return PayOrderTemplateEntity.fromJson(decryptedTemplate);
  }

  async create(
    dto: CreatePayOrderTemplateDto
  ): Promise<PayOrderTemplateEntity> {
    const encryptedDto = this.encryptSensitiveData(dto);
    const newPayOrderTemplate = await prisma.payOrderTemplate.create({
      data: encryptedDto,
    });

    return this.decryptSensitiveData(newPayOrderTemplate);
  }

  async getAll(): Promise<PayOrderTemplateEntity[]> {
    const allPayOrderTemplates = await prisma.payOrderTemplate.findMany();

    return allPayOrderTemplates.map((template) =>
      this.decryptSensitiveData(template)
    );
  }

  async getById(id: string): Promise<PayOrderTemplateEntity> {
    const payOrderTemplate = await prisma.payOrderTemplate.findUnique({
      where: {
        id,
        deleted: false,
      },
    });

    if (!payOrderTemplate) throw new NotFoundError("Template no found");

    return this.decryptSensitiveData(payOrderTemplate);
  }

  async update(
    dto: UpdatePayOrderTemplateDto
  ): Promise<PayOrderTemplateEntity> {
    const { id } = dto;
    await this.getById(id);

    const encryptedDto = this.encryptSensitiveData(dto);
    const updatedPayOrderTemplate = await prisma.payOrderTemplate.update({
      where: {
        id,
      },
      data: encryptedDto,
    });

    return this.decryptSensitiveData(updatedPayOrderTemplate);
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

    return this.decryptSensitiveData(payOrderDeleted);
  }
}
