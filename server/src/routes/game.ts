import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { prisma } from '../lib/prisma';

export async function gameRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();
  const paramsSchema = z.object({ id: z.coerce.number() });

  app.post('/', {
    schema: {
      body: z.object({
        name: z.string(),
        description: z.string().nullish(),
        rules: z.any().optional(), // Aceita JSON estruturado
        active: z.boolean().default(true),
        machineId: z.number().nullish(),
      })
    }
  }, async (request, reply) => {
    const game = await prisma.game.create({ data: request.body });
    return reply.status(201).send(game);
  });

  app.get('/', async () => prisma.game.findMany());

  app.get('/:id', { schema: { params: paramsSchema } }, async (request, reply) => {
    const game = await prisma.game.findUnique({ where: { id: request.params.id } });
    if (!game) return reply.status(404).send({ message: 'Jogo não encontrado' });
    return game;
  });

  app.put('/:id', {
    schema: {
      params: paramsSchema,
      body: z.object({
        name: z.string().optional(),
        description: z.string().nullish(),
        rules: z.any().optional(),
        active: z.boolean().optional(),
        machineId: z.number().nullish(),
      })
    }
  }, async (request) => {
    return prisma.game.update({ where: { id: request.params.id }, data: request.body });
  });

  app.delete('/:id', { schema: { params: paramsSchema } }, async (request, reply) => {
    await prisma.game.delete({ where: { id: request.params.id } });
    return reply.status(204).send();
  });
}