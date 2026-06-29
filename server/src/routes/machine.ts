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
  app.get(
    '/admin/dashboard',
    {
      schema: {
        description: 'Retorna a listagem de máquinas com faturamento e dados agregados de uso diário',
        response: {
          200: z.object({
            totalGamesToday: z.number(),
            machines: z.array(
              z.object({
                name: z.string(),
                location: z.string(),
                status: z.string(),
                lastUseDate: z.string(),
                lastUseTime: z.string(),
                revenue: z.string(),
              })
            ),
            chartData: z.array(
              z.object({
                hour: z.string(),
                count: z.number(),
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      // 1. Busca todas as máquinas do sistema
      const dbMachines = await prisma.machine.findMany({
        include: {
          matches: {
            orderBy: { startedAt: 'desc' },
            take: 1,
          },
          financialTransactions: {
            where: { type: 'TOPUP' }, // Ou 'SALE' dependendo do seu modelo de débito da ficha
            select: { amount: true },
          },
        },
      });

      // 2. Calcula total de partidas hoje (28/06/2026)
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      const totalGamesToday = await prisma.match.count({
        where: {
          startedAt: { gte: startOfToday },
        },
      });

      // 3. Formata os dados de cada máquina para a tabela
      const machines = dbMachines.map((m) => {
        const lastMatch = m.matches[0];
        let dateStr = 'Nunca';
        let timeStr = '--:--';

        if (lastMatch) {
          const matchDate = new Date(lastMatch.startedAt);
          const isToday = matchDate.toDateString() === new Date().toDateString();
          dateStr = isToday ? 'Hoje' : matchDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
          timeStr = matchDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        }

        const totalRevenue = m.financialTransactions.reduce((acc, t) => acc + Number(t.amount), 0);

        return {
          name: m.name,
          location: m.location || 'Geral',
          status: m.active ? 'Online' : 'Manutenção',
          lastUseDate: dateStr,
          lastUseTime: timeStr,
          revenue: `R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        };
      });

      // 4. Mock/Cálculo de distribuição por hora do dia atual para o gráfico Canvas
      const chartData = Array.from({ length: 6 }, (_, i) => {
        const hourLabel = `${10 + i * 2}:00`;
        return { hour: hourLabel, count: Math.floor(Math.random() * 300) + 100 };
      });

      return reply.status(200).send({
        totalGamesToday,
        machines,
        chartData,
      });
    }
  );
}