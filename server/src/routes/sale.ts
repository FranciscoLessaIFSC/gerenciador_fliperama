import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { prisma } from '../lib/prisma';

export async function saleRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();
  const paramsSchema = z.object({ id: z.coerce.number() });
  const PaymentMethodEnum = z.enum(['CASH', 'PIX', 'DEBIT_CARD', 'CREDIT_CARD']);

  app.post('/', {
    schema: {
      body: z.object({
        productId: z.number(),
        machineId: z.number().nullish(),
        employeeId: z.number().nullish(),
        quantity: z.number().int().default(1),
        totalAmount: z.coerce.number(),
        paymentMethod: PaymentMethodEnum,
      })
    }
  }, async (request, reply) => {
    const sale = await prisma.sale.create({ data: request.body });
    return reply.status(201).send(sale);
  });

  app.get('/', async () => prisma.sale.findMany());

  app.get('/:id', { schema: { params: paramsSchema } }, async (request, reply) => {
    const sale = await prisma.sale.findUnique({ where: { id: request.params.id } });
    if (!sale) return reply.status(404).send({ message: 'Venda não encontrada' });
    return sale;
  });

  app.put('/:id', {
    schema: {
      params: paramsSchema,
      body: z.object({
        productId: z.number().optional(),
        machineId: z.number().nullish(),
        employeeId: z.number().nullish(),
        quantity: z.number().int().optional(),
        totalAmount: z.coerce.number().optional(),
        paymentMethod: PaymentMethodEnum.optional(),
      })
    }
  }, async (request) => {
    return prisma.sale.update({ where: { id: request.params.id }, data: request.body });
  });

  app.delete('/:id', { schema: { params: paramsSchema } }, async (request, reply) => {
    await prisma.sale.delete({ where: { id: request.params.id } });
    return reply.status(204).send();
  });
}