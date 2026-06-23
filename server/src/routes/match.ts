import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { prisma } from '../lib/prisma';

export async function matchRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();
  const paramsSchema = z.object({ id: z.coerce.number() });

  app.post('/', {
    schema: {
      body: z.object({
        gameId: z.number(),
        machineId: z.number().nullish(),
        startedAt: z.coerce.date().default(() => new Date()),
        endedAt: z.coerce.date().nullish(),
        notes: z.string().nullish(),
      })
    }
  }, async (request, reply) => {
    const match = await prisma.match.create({ data: request.body });
    return reply.status(201).send(match);
  });

  app.get('/', async () => prisma.match.findMany());

  app.get('/:id', { schema: { params: paramsSchema } }, async (request, reply) => {
    const match = await prisma.match.findUnique({ where: { id: request.params.id } });
    if (!match) return reply.status(404).send({ message: 'Partida não encontrada' });
    return match;
  });

  app.put('/:id', {
    schema: {
      params: paramsSchema,
      body: z.object({
        gameId: z.number().optional(),
        machineId: z.number().nullish(),
        startedAt: z.coerce.date().optional(),
        endedAt: z.coerce.date().nullish(),
        notes: z.string().nullish(),
      })
    }
  }, async (request) => {
    return prisma.match.update({ where: { id: request.params.id }, data: request.body });
  });

  app.delete('/:id', { schema: { params: paramsSchema } }, async (request, reply) => {
    await prisma.match.delete({ where: { id: request.params.id } });
    return reply.status(204).send();
  });
}