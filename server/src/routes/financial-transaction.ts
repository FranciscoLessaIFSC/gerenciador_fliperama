import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { prisma } from '../lib/prisma';

export async function financialTransactionRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();
  const paramsSchema = z.object({ id: z.coerce.number() });

  const TransactionTypeEnum = z.enum(['TOPUP', 'REDEEM_POINTS', 'SALE', 'REFUND']);
  const PaymentMethodEnum = z.enum(['CASH', 'PIX', 'DEBIT_CARD', 'CREDIT_CARD']);

  app.post('/', {
    schema: {
      body: z.object({
        type: TransactionTypeEnum,
        paymentMethod: PaymentMethodEnum,
        amount: z.coerce.number(),
        cardId: z.number().nullish(),
        employeeId: z.number().nullish(),
        machineId: z.number().nullish(),
        description: z.string().nullish(),
        metadata: z.any().optional(),
      })
    }
  }, async (request, reply) => {
    const tx = await prisma.financialTransaction.create({ data: request.body });
    return reply.status(201).send(tx);
  });

  app.post(
    '/buy',
    {
      schema: {
        description: 'Compra de créditos adicionando fundos diretamente ao saldo',
        body: z.object({
          uid: z.string().min(1),
          credits: z.number().positive(),
          amount: z.number().positive(),
        }),
        response: {
          200: z.object({ message: z.string(), newBalance: z.number() }),
          404: z.object({ error: z.string() }),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { uid, credits, amount } = request.body;

      try {
        const result = await prisma.$transaction(async (tx) => {
          const card = await tx.card.findUnique({ where: { uid } });
          if (!card) throw new Error('NOT_FOUND');

          // Incrementa os créditos comprados no saldo atual
          const updatedCard = await tx.card.update({
            where: { uid },
            data: { balance: { increment: credits } },
          });

          // Registra a movimentação no caixa
          await tx.financialTransaction.create({
            data: {
              type: 'TOPUP',
              paymentMethod: 'PIX', // Definido de forma automática como simulado do totem
              amount: amount,
              cardId: card.id,
              description: `Compra de ${credits} créditos via Totem Autoatendimento`,
            },
          });

          return updatedCard;
        });

        return reply.status(200).send({
          message: 'Créditos comprados com sucesso!',
          newBalance: Number(result.balance),
        });
      } catch (error: any) {
        if (error.message === 'NOT_FOUND') {
          return reply.status(404).send({ error: 'Cartão não encontrado.' });
        }
        request.log.error(error);
        return reply.status(500).send({ error: 'Falha ao processar compra.' });
      }
    }
  );

  // 2. POST /financial-transactions/redeem -> Troca de pontos por créditos
  app.post(
    '/redeem',
    {
      schema: {
        description: 'Troca de pontos do histórico por novos créditos de jogo',
        body: z.object({
          uid: z.string().min(1),
          credits: z.number().positive(),
          pointsRequired: z.number().positive(),
        }),
        response: {
          200: z.object({ message: z.string(), newBalance: z.number() }),
          400: z.object({ error: z.string() }),
          404: z.object({ error: z.string() }),
          500: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { uid, credits, pointsRequired } = request.body;

      try {
        const result = await prisma.$transaction(async (tx) => {
          const card = await tx.card.findUnique({ where: { uid } });
          if (!card) throw new Error('NOT_FOUND');

          // Agrega todos os pontos para verificar se ele tem saldo suficiente para gastar
          const totalPointsAggregation = await tx.score.aggregate({
            where: { cardId: card.id },
            _sum: { points: true },
          });
          const totalPoints = totalPointsAggregation._sum.points || 0;

          // Busca quantos pontos ele já resgatou no passado de forma acumulada
          const pointsRedeemedAggregation = await tx.financialTransaction.aggregate({
            where: { cardId: card.id, type: 'REDEEM_POINTS' },
            _sum: { amount: true }, // Usamos a coluna amount para salvar os pontos debitados
          });
          const pointsRedeemed = pointsRedeemedAggregation._sum.amount ? Number(pointsRedeemedAggregation._sum.amount) : 0;

          const pointsAvailable = totalPoints - pointsRedeemed;

          if (pointsAvailable < pointsRequired) {
            throw new Error('INSUFFICIENT_POINTS');
          }

          // Adiciona os créditos ao saldo
          const updatedCard = await tx.card.update({
            where: { uid },
            data: { balance: { increment: credits } },
          });

          // Registra uma transação do tipo REDEEM_POINTS, salvando a perda de pontos no amount
          await tx.financialTransaction.create({
            data: {
              type: 'REDEEM_POINTS',
              paymentMethod: 'CASH', // Valor padrão irrelevante para troca de tickets
              amount: pointsRequired, // Quantidade de pontos queimados nesta operação
              cardId: card.id,
              description: `Resgate de pontos: -${pointsRequired} pontos por +${credits} créditos`,
            },
          });

          return updatedCard;
        });

        return reply.status(200).send({
          message: 'Pontos trocados com sucesso!',
          newBalance: Number(result.balance),
        });
      } catch (error: any) {
        if (error.message === 'NOT_FOUND') return reply.status(404).send({ error: 'Cartão não encontrado.' });
        if (error.message === 'INSUFFICIENT_POINTS') return reply.status(400).send({ error: 'Pontos insuficientes para realizar esta troca.' });
        request.log.error(error);
        return reply.status(500).send({ error: 'Erro ao processar resgate.' });
      }
    }
  );
  
  app.get('/', async () => prisma.financialTransaction.findMany());

  app.get('/:id', { schema: { params: paramsSchema } }, async (request, reply) => {
    const tx = await prisma.financialTransaction.findUnique({ where: { id: request.params.id } });
    if (!tx) return reply.status(404).send({ message: 'Transação não encontrada' });
    return tx;
  });

  app.put('/:id', {
    schema: {
      params: paramsSchema,
      body: z.object({
        type: TransactionTypeEnum.optional(),
        paymentMethod: PaymentMethodEnum.optional(),
        amount: z.coerce.number().optional(),
        cardId: z.number().nullish(),
        employeeId: z.number().nullish(),
        machineId: z.number().nullish(),
        description: z.string().nullish(),
        metadata: z.any().optional(),
      })
    }
  }, async (request) => {
    return prisma.financialTransaction.update({ where: { id: request.params.id }, data: request.body });
  });

  app.delete('/:id', { schema: { params: paramsSchema } }, async (request, reply) => {
    await prisma.financialTransaction.delete({ where: { id: request.params.id } });
    return reply.status(204).send();
  });
}