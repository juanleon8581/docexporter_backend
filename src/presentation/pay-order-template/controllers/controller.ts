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

  /**
   * @openapi
   * /api/payorder:
   *   post:
   *     summary: Create a new pay order template
   *     tags: [PayOrderTemplates]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               userId:
   *                 type: string
   *                 example: "user123"
   *                 description: "ID of the user creating the template"
   *               nameEntry:
   *                 type: string
   *                 example: "Monthly Payment"
   *                 description: "Name of the pay order entry"
   *               nameFor:
   *                 type: string
   *                 example: "John Doe"
   *                 description: "Name of the recipient (optional)"
   *               nitFor:
   *                 type: string
   *                 example: "123456789"
   *                 description: "NIT of the recipient (optional)"
   *               dni:
   *                 type: string
   *                 example: "987654321"
   *                 description: "DNI of the recipient (optional)"
   *               role:
   *                 type: string
   *                 example: "Manager"
   *                 description: "Role of the recipient (optional)"
   *               bank:
   *                 type: string
   *                 example: "Bank of Example"
   *                 description: "Bank name (optional)"
   *               accountNumber:
   *                 type: string
   *                 example: "1234567890"
   *                 description: "Bank account number (optional)"
   *             required:
   *               - userId
   *               - nameEntry
   *     responses:
   *       200:
   *         description: Template created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   example: "template123"
   *                 userId:
   *                   type: string
   *                   example: "user123"
   *                 nameEntry:
   *                   type: string
   *                   example: "Monthly Payment"
   *                 nameFor:
   *                   type: string
   *                   example: "John Doe"
   *                 nitFor:
   *                   type: string
   *                   example: "123456789"
   *                 dni:
   *                   type: string
   *                   example: "987654321"
   *                 role:
   *                   type: string
   *                   example: "Manager"
   *                 bank:
   *                   type: string
   *                   example: "Bank of Example"
   *                 accountNumber:
   *                   type: string
   *                   example: "1234567890"
   *                 createdAt:
   *                   type: string
   *                   format: date-time
   *                   example: "2023-01-01T00:00:00.000Z"
   *                 updatedAt:
   *                   type: string
   *                   format: date-time
   *                   example: "2023-01-01T00:00:00.000Z"
   *       400:
   *         description: Invalid data or unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Invalid Data"
   */
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

  /**
   * @openapi
   * /api/payorder:
   *   get:
   *     summary: Get all pay order templates
   *     tags: [PayOrderTemplates]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of pay order templates retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                     example: "template123"
   *                   userId:
   *                     type: string
   *                     example: "user123"
   *                   nameEntry:
   *                     type: string
   *                     example: "Monthly Payment"
   *                   nameFor:
   *                     type: string
   *                     example: "John Doe"
   *                   nitFor:
   *                     type: string
   *                     example: "123456789"
   *                   dni:
   *                     type: string
   *                     example: "987654321"
   *                   role:
   *                     type: string
   *                     example: "Manager"
   *                   bank:
   *                     type: string
   *                     example: "Bank of Example"
   *                   accountNumber:
   *                     type: string
   *                     example: "1234567890"
   *                   createdAt:
   *                     type: string
   *                     format: date-time
   *                     example: "2023-01-01T00:00:00.000Z"
   *                   updatedAt:
   *                     type: string
   *                     format: date-time
   *                     example: "2023-01-01T00:00:00.000Z"
   *                   deleted:
   *                     type: boolean
   *                     example: false
   *       400:
   *         description: Error retrieving templates
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Failed to retrieve templates"
   */
  public getPayOrderTemplates = (req: Request, res: Response) => {
    new GetPayOrderTemplates(this.payOrderTemplateRepository)
      .execute()
      .then((template) => res.json(template))
      .catch((error) => res.status(400).json(error));
  };

  /**
   * @openapi
   * /api/payorder/{id}:
   *   get:
   *     summary: Get a pay order template by ID
   *     tags: [PayOrderTemplates]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           example: "template123"
   *         description: "ID of the pay order template to retrieve"
   *     responses:
   *       200:
   *         description: Template retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   example: "template123"
   *                 userId:
   *                   type: string
   *                   example: "user123"
   *                 nameEntry:
   *                   type: string
   *                   example: "Monthly Payment"
   *                 nameFor:
   *                   type: string
   *                   example: "John Doe"
   *                 nitFor:
   *                   type: string
   *                   example: "123456789"
   *                 dni:
   *                   type: string
   *                   example: "987654321"
   *                 role:
   *                   type: string
   *                   example: "Manager"
   *                 bank:
   *                   type: string
   *                   example: "Bank of Example"
   *                 accountNumber:
   *                   type: string
   *                   example: "1234567890"
   *                 createdAt:
   *                   type: string
   *                   format: date-time
   *                   example: "2023-01-01T00:00:00.000Z"
   *                 updatedAt:
   *                   type: string
   *                   format: date-time
   *                   example: "2023-01-01T00:00:00.000Z"
   *                 deleted:
   *                   type: boolean
   *                   example: false
   *       400:
   *         description: Template not found or invalid ID
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Template not found"
   */
  public getPayOrderTemplate = (req: Request, res: Response) => {
    const { id } = req.params;

    new GetPayOrderTemplate(this.payOrderTemplateRepository)
      .execute(id)
      .then((template) => res.json(template))
      .catch((error) => res.status(400).json(error));
  };

  /**
   * @openapi
   * /api/payorder:
   *   put:
   *     summary: Update an existing pay order template
   *     tags: [PayOrderTemplates]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               id:
   *                 type: string
   *                 example: "template123"
   *                 description: "ID of the template to update"
   *               userId:
   *                 type: string
   *                 example: "user123"
   *                 description: "ID of the user updating the template"
   *               nameEntry:
   *                 type: string
   *                 example: "Updated Monthly Payment"
   *                 description: "Updated name of the pay order entry"
   *               nameFor:
   *                 type: string
   *                 example: "Jane Doe"
   *                 description: "Updated name of the recipient (optional)"
   *               nitFor:
   *                 type: string
   *                 example: "987654321"
   *                 description: "Updated NIT of the recipient (optional)"
   *               dni:
   *                 type: string
   *                 example: "123456789"
   *                 description: "Updated DNI of the recipient (optional)"
   *               role:
   *                 type: string
   *                 example: "Director"
   *                 description: "Updated role of the recipient (optional)"
   *               bank:
   *                 type: string
   *                 example: "New Bank"
   *                 description: "Updated bank name (optional)"
   *               accountNumber:
   *                 type: string
   *                 example: "0987654321"
   *                 description: "Updated bank account number (optional)"
   *             required:
   *               - id
   *               - userId
   *               - nameEntry
   *     responses:
   *       200:
   *         description: Template updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   example: "template123"
   *                 userId:
   *                   type: string
   *                   example: "user123"
   *                 nameEntry:
   *                   type: string
   *                   example: "Updated Monthly Payment"
   *                 nameFor:
   *                   type: string
   *                   example: "Jane Doe"
   *                 nitFor:
   *                   type: string
   *                   example: "987654321"
   *                 dni:
   *                   type: string
   *                   example: "123456789"
   *                 role:
   *                   type: string
   *                   example: "Director"
   *                 bank:
   *                   type: string
   *                   example: "New Bank"
   *                 accountNumber:
   *                   type: string
   *                   example: "0987654321"
   *                 createdAt:
   *                   type: string
   *                   format: date-time
   *                   example: "2023-01-01T00:00:00.000Z"
   *                 updatedAt:
   *                   type: string
   *                   format: date-time
   *                   example: "2023-01-02T00:00:00.000Z"
   *       400:
   *         description: Invalid data or unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Invalid Data"
   */
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

  /**
   * @openapi
   * /api/payorder/{id}:
   *   delete:
   *     summary: Delete a pay order template by ID
   *     tags: [PayOrderTemplates]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           example: "template123"
   *         description: "ID of the pay order template to delete"
   *     responses:
   *       200:
   *         description: Template deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   example: "template123"
   *                 userId:
   *                   type: string
   *                   example: "user123"
   *                 nameEntry:
   *                   type: string
   *                   example: "Monthly Payment"
   *                 nameFor:
   *                   type: string
   *                   example: "John Doe"
   *                 nitFor:
   *                   type: string
   *                   example: "123456789"
   *                 dni:
   *                   type: string
   *                   example: "987654321"
   *                 role:
   *                   type: string
   *                   example: "Manager"
   *                 bank:
   *                   type: string
   *                   example: "Bank of Example"
   *                 accountNumber:
   *                   type: string
   *                   example: "1234567890"
   *                 createdAt:
   *                   type: string
   *                   format: date-time
   *                   example: "2023-01-01T00:00:00.000Z"
   *                 updatedAt:
   *                   type: string
   *                   format: date-time
   *                   example: "2023-01-01T00:00:00.000Z"
   *                 deleted:
   *                   type: boolean
   *                   example: true
   *                 deletedAt:
   *                   type: string
   *                   format: date-time
   *                   example: "2023-01-02T00:00:00.000Z"
   *       400:
   *         description: Template not found or invalid ID
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Template not found"
   */
  public deletePayOrderTemplate = (req: Request, res: Response) => {
    const { id } = req.params;

    new DeletePayOrderTemplate(this.payOrderTemplateRepository)
      .execute(id)
      .then((template) => res.json(template))
      .catch((error) => res.status(400).json(error));
  };
}
