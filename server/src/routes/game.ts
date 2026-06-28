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

  app.get(
    '/',
    {
      schema: {
        description: 'Lista todos os jogos ativos cadastrados',
        response: {
          200: z.array(
            z.object({
              id: z.number(),
              name: z.string(),
            })
          ),
        },
      },
    },
    async (request, reply) => {
      const games = await prisma.game.findMany({
        where: { active: true },
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
      });
      return reply.status(200).send(games);
    }
  );

  // 2. GET /games/rankings -> Retorna as duas tabelas baseadas nos filtros
  app.get(
    '/rankings',
    {
      schema: {
        description: 'Retorna rankings de pontuação máxima por jogo e por jogador',
        querystring: z.object({
          gameId: z.string().optional(), // "all" ou ID numérico do jogo
        }),
        response: {
          200: z.object({
            byGame: z.array(
              z.object({
                gameName: z.string(),
                points: z.number(),
                date: z.string(),
              })
            ),
            byPlayer: z.array(
              z.object({
                playerName: z.string(),
                points: z.number(),
                date: z.string(),
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const { gameId } = request.query;
      
      // Monta a condição de filtro baseada no parâmetro recebido
      const whereFilter: any = {};
      if (gameId && gameId !== 'all') {
        whereFilter.gameId = Number(gameId);
      }

      // --- TABELA 1: Maiores pontuações (Rank por Jogo) ---
      const scoresByGame = await prisma.score.findMany({
        where: whereFilter,
        orderBy: { points: 'desc' },
        take: 10, // Top 10 recordes gerais
        include: {
          game: { select: { name: true } },
          card: { select: { name: true } },
        },
      });

      const formattedByGame = scoresByGame.map((s) => ({
        gameName: s.game?.name || 'Jogo Desconhecido',
        points: s.points,
        date: s.recordedAt.toISOString().split('T')[0],
      }));

      // --- TABELA 2: Melhores pontuações por Jogador (Rank por Cartão) ---
      // Agrupamos os scores por cartão para achar a pontuação máxima de cada pessoa
      const playerGroup = await prisma.score.groupBy({
        by: ['cardId'],
        where: whereFilter,
        _max: { points: true },
        orderBy: { _max: { points: 'desc' } },
        take: 10,
      });

      // Como o groupBy não faz include direto das tabelas relacionadas, resolvemos as promessas em paralelo
      const formattedByPlayer = await Promise.all(
        playerGroup.map(async (group) => {
          // Busca o último score que gerou aquela pontuação máxima para capturar a data e o nome do portador
          const details = await prisma.score.findFirst({
            where: {
              cardId: group.cardId,
              points: group._max.points || 0,
              ...whereFilter,
            },
            include: { card: { select: { name: true } } },
          });

          return {
            playerName: details?.card?.name || `Jogador #${group.cardId}`,
            points: group._max.points || 0,
            date: details ? details.recordedAt.toISOString().split('T')[0] : 'N/A',
          };
        })
      );

      return reply.status(200).send({
        byGame: formattedByGame,
        byPlayer: formattedByPlayer,
      });
    }
  );

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