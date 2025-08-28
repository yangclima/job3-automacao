import { PrismaClient } from '../generated/prisma/index.js';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

function randomDateWithin5Months() {
  const now = new Date();
  const past5Months = new Date();
  past5Months.setMonth(now.getMonth() - 5);

  const randomTime = past5Months.getTime() + Math.random() * (now.getTime() - past5Months.getTime());
  return new Date(randomTime);
}

async function populateUsers() {
  console.log('Criando usuários...');
  
  const users = [
    { username: 'admin', name: 'Administrador', password: 'admin123', role: 'GERENTE' },
    { username: 'operador01', name: 'João Silva', password: 'senha123', role: 'OPERADOR' },
    { username: 'operador02', name: 'Maria Santos', password: 'senha123', role: 'OPERADOR' },
    { username: 'operador03', name: 'Pedro Oliveira', password: 'senha123', role: 'OPERADOR' },
    { username: 'supervisor01', name: 'Ana Costa', password: 'senha123', role: 'GERENTE' },
    { username: 'tecnico01', name: 'Carlos Ferreira', password: 'senha123', role: 'OPERADOR' }
  ];

  const createdUsers = [];
  
  for (const userData of users) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await prisma.user.upsert({
        where: { username: userData.username },
        update: {},
        create: {
          username: userData.username,
          name: userData.name,
          password: hashedPassword,
          role: userData.role
        }
      });
      
      createdUsers.push(user);
      console.log(`✓ Usuário criado: ${user.username} (${user.name}) - ${user.role}`);
    } catch (error) {
      console.log(`⚠ Usuário ${userData.username} já existe`);
    }
  }

  return createdUsers;
}

async function populateCoils(users) {
  console.log('Criando bobinas...');
  
  const types = ['t20cm', 't40cm'];
  const warehouses = ['A', 'B'];
  
  // Limpa as bobinas existentes para recriar com usuários
  await prisma.coil.deleteMany({});
  console.log('Bobinas existentes removidas');

  const coils = [];

  for (let i = 0; i < 150; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const warehouse = warehouses[Math.floor(Math.random() * warehouses.length)];
    const size = parseFloat((Math.random() * 50 + 10).toFixed(2)); // tamanho entre 10 e 60
    const manufactureDate = randomDateWithin5Months();
    
    // Seleciona um usuário aleatório para ser o criador
    const randomUser = users[Math.floor(Math.random() * users.length)];

    coils.push({
      type,
      warehouse,
      size,
      manufactureDate,
      createdById: randomUser.id
    });
  }

  const created = await prisma.coil.createMany({
    data: coils,
    skipDuplicates: true
  });

  console.log(`✓ ${created.count} bobinas criadas`);
  
  return created;
}

async function main() {
  try {
    console.log('🚀 Iniciando população do banco de dados...\n');
    
    // Primeiro, cria os usuários
    const users = await populateUsers();
    console.log(`\n📊 Total de usuários: ${users.length}\n`);
    
    // Em seguida, cria as bobinas associadas aos usuários
    const coils = await populateCoils(users);
    console.log(`📊 Total de bobinas: ${coils.count}\n`);
    
    console.log('✅ População do banco de dados concluída com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro durante a população:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Erro fatal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('🔌 Conexão com o banco encerrada');
  });