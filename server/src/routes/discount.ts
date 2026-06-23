import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { prisma } from '../lib/prisma';

export async function discountRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();
  const paramsSchema = z.object({ id: z.coerce.number() });

  app.post('/', {
    schema: {
      body: z.object({
        code: z.string(),
        description: z.string().nullish(),
        percent: z.number().int().nullish(),
        amount: z.coerce.number().nullish(),
        startsAt: z.coerce.date().nullish(),
        endsAt: z.coerce.date().nullish(),
        active: z.boolean().default(true),
      })
    }
  }, async (request, reply) => {
    const discount = await prisma.discount.create({ data: request.body });
    return reply.status(201).send(discount);
  });

  app.get('/', async () => prisma.discount.findMany());

  app.get('/:id', { schema: { params: paramsSchema } }, async (request, reply) => {
    const discount = await prisma.discount.findUnique({ where: { id: request.params.id } });
    if (!discount) return reply.status(404).send({ message: 'Desconto não encontrado' });
    return discount;
  });

  app.put('/:id', {
    schema: {
      params: paramsSchema,
      body: z.object({
        code: z.string().optional(),
        description: z.string().nullish(),
        percent: z.number().int().nullish(),
        amount: z.coerce.number().nullish(),
        startsAt: z.coerce.date().nullish(),
        endsAt: z.coerce.date().nullish(),
        active: z.boolean().optional(),
      })
    }
  }, async (request) => {
    return prisma.discount.update({ where: { id: request.params.id }, data: request.body });
  });

  app.delete('/:id', { schema: { params: paramsSchema } }, async (request, reply) => {
    await prisma.discount.delete({ where: { id: request.params.id } });
    return reply.status(204).send();
  });
}