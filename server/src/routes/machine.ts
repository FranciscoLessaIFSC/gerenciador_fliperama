import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { prisma } from '../lib/prisma';

export async function machineRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();
  const paramsSchema = z.object({ id: z.coerce.number() });

  app.post('/', {
    schema: {
      body: z.object({
        name: z.string(),
        location: z.string().nullish(),
        serial: z.string().nullish(),
        active: z.boolean().default(true),
      })
    }
  }, async (request, reply) => {
    const machine = await prisma.machine.create({ data: request.body });
    return reply.status(201).send(machine);
  });

  app.get('/', async () => prisma.machine.findMany());

  app.get('/:id', { schema: { params: paramsSchema } }, async (request, reply) => {
    const machine = await prisma.machine.findUnique({ where: { id: request.params.id } });
    if (!machine) return reply.status(404).send({ message: 'Máquina não encontrada' });
    return machine;
  });

  app.put('/:id', {
    schema: {
      params: paramsSchema,
      body: z.object({
        name: z.string().optional(),
        location: z.string().nullish(),
        serial: z.string().nullish(),
        active: z.boolean().optional(),
      })
    }
  }, async (request) => {
    return prisma.machine.update({ where: { id: request.params.id }, data: request.body });
  });

  app.delete('/:id', { schema: { params: paramsSchema } }, async (request, reply) => {
    await prisma.machine.delete({ where: { id: request.params.id } });
    return reply.status(204).send();
  });
}