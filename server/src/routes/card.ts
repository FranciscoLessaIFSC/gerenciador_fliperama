import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { prisma } from '../lib/prisma';

export async function cardRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  // Schema de ID comum
  const paramsSchema = z.object({ uid: z.coerce.string() });

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
  app.get(
    '/:uid',
    {
      schema: {
        description: 'Retorna o saldo, pontuação total acumulada e o histórico dos últimos 5 jogos do cartão',
        params: z.object({
          uid: z.string().min(1, 'O UID do cartão é obrigatório'),
        }),
        response: {
          200: z.object({
            uid: z.string(),
            name: z.string().nullable(),
            balance: z.number(),
            totalScore: z.number(),
            recentGames: z.array(
              z.object({
                gameName: z.string(),
                points: z.number(),
                date: z.string(), // Formato YYYY-MM-DD
              })
            ),
          }),
          404: z.object({
            error: z.string(),
          }),
          500: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { uid } = request.params;

        // 1. Busca o cartão no banco de dados e inclui os últimos 5 scores ordenados por data
        const card = await prisma.card.findUnique({
          where: { uid },
          include: {
            scores: {
              take: 5,
              orderBy: { recordedAt: 'desc' },
              include: {
                game: {
                  select: { name: true },
                },
              },
            },
          },
        });

        if (!card) {
          return reply.status(404).send({ error: 'Cartão não encontrado.' });
        }

        // 2. Agrega a soma de todos os pontos (Score) já feitos por este cartão na história do arcade
        const totalScoreAggregation = await prisma.score.aggregate({
          where: { cardId: card.id },
          _sum: {
            points: true,
          },
        });

        const totalScore = totalScoreAggregation._sum.points || 0;

        // 3. Formata e mapeia a resposta para cumprir o contrato do Zod e do Frontend
        return reply.status(200).send({
          uid: card.uid,
          name: card.name,
          // Converte o campo Decimal do Prisma para número flutuante/inteiro nativo do JS
          balance: Number(card.balance), 
          totalScore: totalScore,
          recentGames: card.scores.map((scoreItem) => ({
            gameName: scoreItem.game?.name || 'Jogo Desconhecido',
            points: scoreItem.points,
            // Retorna apenas a parte YYYY-MM-DD exigida pela tabela HTML do dashboard
            date: scoreItem.recordedAt.toISOString().split('T')[0], 
          })),
        });

      } catch (error) {
        request.log.error(error);
        return reply.status(500).send({ error: 'Erro interno ao processar dados do cartão.' });
      }
    }
  );

    // 1. GET /cards/admin/list -> Lista todos os usuários cadastrados
  app.get(
    '/admin/list',
    {
      schema: {
        description: 'Lista todos os cartões para o painel administrativo',
        response: {
          200: z.array(
            z.object({
              id: z.number(),
              uid: z.string(),
              name: z.string().nullable(),
              balance: z.number(),
              createdAt: z.string(),
            })
          ),
        },
      },
    },
    async (request, reply) => {
      const cards = await prisma.card.findMany({
        orderBy: { createdAt: 'desc' },
      });

      const formattedCards = cards.map(c => ({
        id: c.id,
        uid: c.uid,
        name: c.name,
        balance: Number(c.balance),
        createdAt: c.createdAt.toLocaleDateString('pt-BR'),
      }));

      return reply.status(200).send(formattedCards);
    }
  );

  // 2. GET /cards/admin/:id/history -> Histórico do modal para um cartão específico
  app.get(
    '/admin/:id/history',
    {
      schema: {
        description: 'Busca o histórico recente de scores de um usuário pelo ID',
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: z.array(
            z.object({
              gameName: z.string(),
              points: z.string(),
              creditsUsed: z.string(),
            })
          ),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const scores = await prisma.score.findMany({
        where: { cardId: Number(id) },
        take: 5,
        orderBy: { recordedAt: 'desc' },
        include: {
          game: { select: { name: true } }
        }
      });

      // Mapeia os dados fingindo o custo de créditos padrão (ex: -2 CR) ou buscando de transações se preferir
      const history = scores.map(s => ({
        gameName: s.game?.name || 'Jogo Desconhecido',
        points: `${s.points.toLocaleString('pt-BR')} pts`,
        creditsUsed: s.metadata && (s.metadata as any).cost ? `-${(s.metadata as any).cost} CR` : '-2 CR'
      }));

      return reply.status(200).send(history);
    }
  );
  
  // UPDATE
  app.put('/:uid', {
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
      where: { uid: request.params.uid },
      data: request.body
    });
  });

  // DELETE
  app.delete('/:uid', { schema: { params: paramsSchema } }, async (request, reply) => {
    await prisma.card.delete({ where: { uid: request.params.uid } });
    return reply.status(204).send();
  });
}