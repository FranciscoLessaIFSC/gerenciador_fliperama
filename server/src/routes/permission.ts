import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { prisma } from '../lib/prisma';

export async function permissionRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();
  const paramsSchema = z.object({ id: z.coerce.number() });

  app.post('/', {
    schema: {
      body: z.object({
        name: z.string(),
      })
    }
  }, async (request, reply) => {
    const perm = await prisma.permission.create({ data: request.body });
    return reply.status(201).send(perm);
  });

  app.get('/', async () => prisma.permission.findMany());

  // Rota auxiliar para associar Permissão ao Funcionário (Tabela Pivot NxN)
  app.post('/attach', {
    schema: {
      body: z.object({
        employeeId: z.number(),
        permissionId: z.number(),
      })
    }
  }, async (request, reply) => {
    const relation = await prisma.employeesOnPermissions.create({ data: request.body });
    return reply.status(201).send(relation);
  });

  app.delete('/detach', {
    schema: {
      body: z.object({
        employeeId: z.number(),
        permissionId: z.number(),
      })
    }
  }, async (request, reply) => {
    await prisma.employeesOnPermissions.delete({
      where: {
        employeeId_permissionId: {
          employeeId: request.body.employeeId,
          permissionId: request.body.permissionId,
        }
      }
    });
    return reply.status(204).send();
  });
}