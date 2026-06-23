import Fastify from 'fastify';

import { 
  serializerCompiler, 
  validatorCompiler, 
  ZodTypeProvider 
} from 'fastify-type-provider-zod';

// Rotas dos CRUDs
import { cardRoutes } from './routes/card';
import { machineRoutes } from './routes/machine';
import { gameRoutes } from './routes/game';
import { scoreRoutes } from './routes/score';
import { matchRoutes } from './routes/match';
import { employeeRoutes } from './routes/employee';
import { permissionRoutes } from './routes/permission';
import { discountRoutes } from './routes/discount';
import { financialTransactionRoutes } from './routes/financial-transaction';
import { productRoutes } from './routes/product';
import { saleRoutes } from './routes/sale';
import { attendanceRoutes } from './routes/attendance';

const fastify = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

// Configura os compiladores do Zod no Fastify
fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

// Registro das Rotas
fastify.register(cardRoutes, { prefix: '/cards' });
fastify.register(machineRoutes, { prefix: '/machines' });
fastify.register(gameRoutes, { prefix: '/games' });
fastify.register(scoreRoutes, { prefix: '/scores' });
fastify.register(matchRoutes, { prefix: '/matches' });
fastify.register(employeeRoutes, { prefix: '/employees' });
fastify.register(permissionRoutes, { prefix: '/permissions' });
fastify.register(discountRoutes, { prefix: '/discounts' });
fastify.register(financialTransactionRoutes, { prefix: '/financial-transactions' });
fastify.register(productRoutes, { prefix: '/products' });
fastify.register(saleRoutes, { prefix: '/sales' });
fastify.register(attendanceRoutes, { prefix: '/attendances' });

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('🚀 Servidor rodando na porta 3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();