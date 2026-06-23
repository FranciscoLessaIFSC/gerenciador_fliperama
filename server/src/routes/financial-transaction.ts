import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { prisma } from '../lib/prisma';

export async function financialTransactionRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();
  const paramsSchema = z.object({ id: z.coerce.number() });

  const TransactionTypeEnum = z.enum(['TOPUP', 'REDEEM_POINTS', 'SALE', 'REFUND']);
  const PaymentMethodEnum = z.enum(['CASH', 'PIX', 'DEBIT_CARD', 'CREDIT_CARD']);

  app.post('/', {
    schema: {
      body: z.object({
        type: TransactionTypeEnum,
        paymentMethod: PaymentMethodEnum,
        amount: z.coerce.number(),
        cardId: z.number().nullish(),
        employeeId: z.number().nullish(),
        machineId: z.number().nullish(),
        description: z.string().nullish(),
        metadata: z.any().optional(),
      })
    }
  }, async (request, reply) => {
    const tx = await prisma.financialTransaction.create({ data: request.body });
    return reply.status(201).send(tx);
  });

  app.get('/', async () => prisma.financialTransaction.findMany());

  app.get('/:id', { schema: { params: paramsSchema } }, async (request, reply) => {
    const tx = await prisma.financialTransaction.findUnique({ where: { id: request.params.id } });
    if (!tx) return reply.status(404).send({ message: 'Transação não encontrada' });
    return tx;
  });

  app.put('/:id', {
    schema: {
      params: paramsSchema,
      body: z.object({
        type: TransactionTypeEnum.optional(),
        paymentMethod: PaymentMethodEnum.optional(),
        amount: z.coerce.number().optional(),
        cardId: z.number().nullish(),
        employeeId: z.number().nullish(),
        machineId: z.number().nullish(),
        description: z.string().nullish(),
        metadata: z.any().optional(),
      })
    }
  }, async (request) => {
    return prisma.financialTransaction.update({ where: { id: request.params.id }, data: request.body });
  });

  app.delete('/:id', { schema: { params: paramsSchema } }, async (request, reply) => {
    await prisma.financialTransaction.delete({ where: { id: request.params.id } });
    return reply.status(204).send();
  });
}