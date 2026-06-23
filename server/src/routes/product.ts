import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { prisma } from '../lib/prisma';

export async function productRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();
  const paramsSchema = z.object({ id: z.coerce.number() });

  app.post('/', {
    schema: {
      body: z.object({
        sku: z.string().nullish(),
        name: z.string(),
        description: z.string().nullish(),
        price: z.coerce.number(),
        stock: z.number().int().default(0),
        availableInTotem: z.boolean().default(false),
      })
    }
  }, async (request, reply) => {
    const product = await prisma.product.create({ data: request.body });
    return reply.status(201).send(product);
  });

  app.get('/', async () => prisma.product.findMany());

  app.get('/:id', { schema: { params: paramsSchema } }, async (request, reply) => {
    const product = await prisma.product.findUnique({ where: { id: request.params.id } });
    if (!product) return reply.status(404).send({ message: 'Produto não encontrado' });
    return product;
  });

  app.put('/:id', {
    schema: {
      params: paramsSchema,
      body: z.object({
        sku: z.string().nullish(),
        name: z.string().optional(),
        description: z.string().nullish(),
        price: z.coerce.number().optional(),
        stock: z.number().int().optional(),
        availableInTotem: z.boolean().optional(),
      })
    }
  }, async (request) => {
    return prisma.product.update({ where: { id: request.params.id }, data: request.body });
  });

  app.delete('/:id', { schema: { params: paramsSchema } }, async (request, reply) => {
    await prisma.product.delete({ where: { id: request.params.id } });
    return reply.status(204).send();
  });
}