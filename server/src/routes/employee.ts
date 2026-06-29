import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { prisma } from '../lib/prisma';

export async function employeeRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();
  const paramsSchema = z.object({ id: z.coerce.number() });

  // Enum nativo do Prisma mapeado no Zod
  const RoleEnum = z.enum(['ADMIN', 'MANAGER', 'CASHIER', 'OPERATOR']);

  app.post('/', {
    schema: {
      body: z.object({
        name: z.string(),
        email: z.string().email().nullish(),
        passwordHash: z.string().nullish(),
        role: RoleEnum.default('CASHIER'),
        bankInfo: z.any().optional(),
        active: z.boolean().default(true),
        mfaEnabled: z.boolean().default(false),
      })
    }
  }, async (request, reply) => {
    const employee = await prisma.employee.create({ data: request.body });
    return reply.status(201).send(employee);
  });

  app.get('/', async () => prisma.employee.findMany());

  app.get('/:id', { schema: { params: paramsSchema } }, async (request, reply) => {
    const employee = await prisma.employee.findUnique({ where: { id: request.params.id } });
    if (!employee) return reply.status(404).send({ message: 'Funcionário não encontrado' });
    return employee;
  });

  app.put('/:id', {
    schema: {
      params: paramsSchema,
      body: z.object({
        name: z.string().optional(),
        email: z.string().email().nullish(),
        passwordHash: z.string().nullish(),
        role: RoleEnum.optional(),
        bankInfo: z.any().optional(),
        active: z.boolean().optional(),
        mfaEnabled: z.boolean().optional(),
      })
    }
  }, async (request) => {
    return prisma.employee.update({ where: { id: request.params.id }, data: request.body });
  });

  app.delete('/:id', { schema: { params: paramsSchema } }, async (request, reply) => {
    await prisma.employee.delete({ where: { id: request.params.id } });
    return reply.status(204).send();
  });

  app.get(
    '/admin/list',
    {
      schema: {
        description: 'Lista todos os funcionários ativos para o painel administrativo',
        response: {
          200: z.array(
            z.object({
              id: z.number(),
              name: z.string(),
              role: z.string(),
            })
          ),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const employees = await prisma.employee.findMany({
          where: { active: true },
          select: {
            id: true,
            name: true,
            role: true,
          },
          orderBy: { name: 'asc' },
        });

        return reply.status(200).send(employees);
      } catch (error) {
        request.log.error(error);
        return reply.status(500).send({ error: 'Erro interno ao listar funcionários.' });
      }
    }
  );
}