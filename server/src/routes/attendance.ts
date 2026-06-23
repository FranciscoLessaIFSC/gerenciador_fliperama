import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { prisma } from '../lib/prisma';

export async function attendanceRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();
  const paramsSchema = z.object({ id: z.coerce.number() });
  const AttendanceTypeEnum = z.enum(['IN', 'OUT']);

  app.post('/', {
    schema: {
      body: z.object({
        employeeId: z.number(),
        type: AttendanceTypeEnum,
        timestamp: z.coerce.date().default(() => new Date()),
      })
    }
  }, async (request, reply) => {
    const att = await prisma.attendance.create({ data: request.body });
    return reply.status(201).send(att);
  });

  app.get('/', async () => prisma.attendance.findMany());

  app.get('/:id', { schema: { params: paramsSchema } }, async (request, reply) => {
    const att = await prisma.attendance.findUnique({ where: { id: request.params.id } });
    if (!att) return reply.status(404).send({ message: 'Registro de ponto não encontrado' });
    return att;
  });

  app.put('/:id', {
    schema: {
      params: paramsSchema,
      body: z.object({
        employeeId: z.number().optional(),
        type: AttendanceTypeEnum.optional(),
        timestamp: z.coerce.date().optional(),
      })
    }
  }, async (request) => {
    return prisma.attendance.update({ where: { id: request.params.id }, data: request.body });
  });

  app.delete('/:id', { schema: { params: paramsSchema } }, async (request, reply) => {
    await prisma.attendance.delete({ where: { id: request.params.id } });
    return reply.status(204).send();
  });
}