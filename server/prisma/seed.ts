import { prisma } from '../src/lib/prisma'

async function main() {
  console.log('🔄 Limpando banco de dados anterior...');
  
  // Exclusão na ordem correta devido às chaves estrangeiras
  await prisma.auditLog.deleteMany({});
  await prisma.attendance.deleteMany({});
  await prisma.sale.deleteMany({});
  await prisma.financialTransaction.deleteMany({});
  await prisma.score.deleteMany({});
  await prisma.match.deleteMany({});
  await prisma.employeesOnPermissions.deleteMany({});
  await prisma.permission.deleteMany({});
  await prisma.employee.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.discount.deleteMany({});
  await prisma.game.deleteMany({});
  await prisma.machine.deleteMany({});
  await prisma.card.deleteMany({});

  console.log('🌱 Inserindo dados mockados...');

  // 1. Cadastrando Cartões (Jogadores)
  const card1 = await prisma.card.create({
    data: { uid: 'RFID_DEFAULT_123', name: 'Ana Souza', balance: 47.00 }
  });
  const card2 = await prisma.card.create({
    data: { uid: 'RFID_LEO_456', name: 'Leo Costa', balance: 12.50 }
  });
  const card3 = await prisma.card.create({
    data: { uid: 'RFID_MARINA_789', name: 'Marina Luz', balance: 120.00 }
  });

  // 2. Cadastrando Máquinas Físicas
  const mac1 = await prisma.machine.create({ data: { name: 'Fliperama A1', location: 'Zona Norte', serial: 'MAC-001' } });
  const mac2 = await prisma.machine.create({ data: { name: 'Fliperama A2', location: 'Zona Norte', serial: 'MAC-002' } });
  const mac3 = await prisma.machine.create({ data: { name: 'Cockpit Corrida', location: 'Zona Central', serial: 'MAC-003' } });

  // 3. Cadastrando Jogos
  const game1 = await prisma.game.create({ data: { name: 'Space Raiders', description: 'Atirador espacial clássico', machineId: mac1.id } });
  const game2 = await prisma.game.create({ data: { name: 'Turbo Kart', description: 'Corrida arcade frenética', machineId: mac3.id } });
  const game3 = await prisma.game.create({ data: { name: 'Neon Fighter', description: 'Combate cyberpunk de arena', machineId: mac2.id } });
  const game4 = await prisma.game.create({ data: { name: 'Pixel Striker', description: 'Plataforma de ação retrô', machineId: mac1.id } });
  const game5 = await prisma.game.create({ data: { name: 'Galaxy Rush', description: 'Navegação em alta velocidade', machineId: mac2.id } });

  // 4. Cadastrando Funcionários e Permissões
  const permAdmin = await prisma.permission.create({ data: { name: 'FULL_ACCESS' } });
  const employee = await prisma.employee.create({
    data: {
      name: 'Carlos Caixa',
      email: 'carlos@arcade.com',
      passwordHash: 'argon2_or_bcrypt_hash_here',
      role: 'CASHIER'
    }
  });
  await prisma.employeesOnPermissions.create({
    data: { employeeId: employee.id, permissionId: permAdmin.id }
  });

  // 5. Cadastrando Histórico de Pontuações (Scores)
  // Vinculando pontuações para Ana Souza (Para bater com os dados do seu Dashboard e Ranking)
  await prisma.score.createMany({
    data: [
      { cardId: card1.id, gameId: game1.id, machineId: mac1.id, points: 2900, recordedAt: new Date('2026-04-14T15:30:00Z') },
      { cardId: card1.id, gameId: game2.id, machineId: mac3.id, points: 1870, recordedAt: new Date('2026-04-13T18:22:00Z') },
      { cardId: card1.id, gameId: game3.id, machineId: mac2.id, points: 3420, recordedAt: new Date('2026-04-12T20:05:00Z') },
      { cardId: card1.id, gameId: game4.id, machineId: mac1.id, points: 1660, recordedAt: new Date('2026-04-11T14:10:00Z') },
      { cardId: card1.id, gameId: game5.id, machineId: mac2.id, points: 2990, recordedAt: new Date('2026-04-10T21:45:00Z') },
      // Mais pontos para inflar o total do Dashboard (2900+1870+3420+1660+2990 = 12840)
      { cardId: card1.id, gameId: game1.id, machineId: mac1.id, points: 1000, recordedAt: new Date('2026-04-14T15:00:00Z') }, 
    ]
  });

  // Pontuações dos outros jogadores para montar o Painel de Ranking por Jogador
  await prisma.score.create({
    data: { cardId: card2.id, gameId: game2.id, machineId: mac3.id, points: 920, recordedAt: new Date('2026-05-19T16:00:00Z') }
  });
  await prisma.score.create({
    data: { cardId: card3.id, gameId: game3.id, machineId: mac2.id, points: 775, recordedAt: new Date('2026-03-12T19:30:00Z') }
  });

  // 6. Transações Financeiras (Histórico de Recargas do Totem)
  await prisma.financialTransaction.create({
    data: {
      type: 'TOPUP',
      paymentMethod: 'PIX',
      amount: 50.00,
      cardId: card1.id,
      employeeId: employee.id,
      description: 'Recarga via Pix no balcão'
    }
  });

  // 7. Catálogo de Produtos e Vendas da Lanchonete/Totem
  const product = await prisma.product.create({
    data: { sku: 'PROD-SODA', name: 'Refrigerante 350ml', price: 6.50, stock: 100, availableInTotem: true }
  });
  await prisma.sale.create({
    data: { productId: product.id, employeeId: employee.id, quantity: 2, totalAmount: 13.00, paymentMethod: 'CASH' }
  });

  // 8. Registro de Ponto do Funcionário
  await prisma.attendance.create({
    data: { employeeId: employee.id, type: 'IN', timestamp: new Date() }
  });

  console.log('✅ Banco de dados mockado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });