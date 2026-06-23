import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { prisma } from '../lib/prisma';

export async function cardRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  // Schema de ID comum
  const paramsSchema = z.object({ id: z.coerce.number() });

  // CREATE
  app.post('/', {
    schema: {
      body: z.object({
        uid: z.string(),
        name: z.string().nullish(),
        balance: z.coerce.number().default(0),
      })
    }
  }, async (request, reply) => {
    const card = await prisma.card.create({ data: request.body });
    return reply.status(201).send(card);
  });

  // READ ALL
  app.get('/', async () => {
    return prisma.card.findMany();
  });

  // READ SINGLE
  app.get('/:id', { schema: { params: paramsSchema } }, async (request, reply) => {
    const card = await prisma.card.findUnique({ where: { id: request.params.id } });
    if (!card) return reply.status(404).send({ message: 'Cartão não encontrado' });
    return card;
  });

  // UPDATE
  app.put('/:id', {
    schema: {
      params: paramsSchema,
      body: z.object({
        uid: z.string().optional(),
        name: z.string().nullish(),
        balance: z.coerce.number().optional(),
      })
    }
  }, async (request) => {
    return prisma.card.update({
      where: { id: request.params.id },
      data: request.body
    });
  });

  // DELETE
  app.delete('/:id', { schema: { params: paramsSchema } }, async (request, reply) => {
    await prisma.card.delete({ where: { id: request.params.id } });
    return reply.status(204).send();
  });
}