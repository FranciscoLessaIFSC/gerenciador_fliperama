import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { prisma } from '../lib/prisma';

export async function scoreRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();
  const paramsSchema = z.object({ id: z.coerce.number() });

  app.post('/', {
    schema: {
      body: z.object({
        cardId: z.number(),
        gameId: z.number().nullish(),
        machineId: z.number().nullish(),
        points: z.number().int(),
        metadata: z.any().optional(),
      })
    }
  }, async (request, reply) => {
    const score = await prisma.score.create({ data: request.body });
    return reply.status(201).send(score);
  });

  app.get('/', async () => prisma.score.findMany());

  app.get('/:id', { schema: { params: paramsSchema } }, async (request, reply) => {
    const score = await prisma.score.findUnique({ where: { id: request.params.id } });
    if (!score) return reply.status(404).send({ message: 'Pontuação não encontrada' });
    return score;
  });

  app.put('/:id', {
    schema: {
      params: paramsSchema,
      body: z.object({
        cardId: z.number().optional(),
        gameId: z.number().nullish(),
        machineId: z.number().nullish(),
        points: z.number().int().optional(),
        metadata: z.any().optional(),
      })
    }
  }, async (request) => {
    return prisma.score.update({ where: { id: request.params.id }, data: request.body });
  });

  app.delete('/:id', { schema: { params: paramsSchema } }, async (request, reply) => {
    await prisma.score.delete({ where: { id: request.params.id } });
    return reply.status(204).send();
  });
}
