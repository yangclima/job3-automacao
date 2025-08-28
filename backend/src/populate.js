import { PrismaClient } from '../generated/prisma/index.js';


const prisma = new PrismaClient();

function randomDateWithin5Months() {
  const now = new Date();
  const past5Months = new Date();
  past5Months.setMonth(now.getMonth() - 5);

  const randomTime = past5Months.getTime() + Math.random() * (now.getTime() - past5Months.getTime());
  return new Date(randomTime);
}

async function main() {
  const types = ['t20cm', 't40cm'];
  const warehouses = ['A', 'B'];
  const coils = [];

  for (let i = 0; i < 150; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const warehouse = warehouses[Math.floor(Math.random() * warehouses.length)];
    const size = parseFloat((Math.random() * 50 + 10).toFixed(2)); // tamanho entre 10 e 60
    const manufactureDate = randomDateWithin5Months();

    coils.push({
      type,
      warehouse,
      size,
      manufactureDate
    });
  }

  const created = await prisma.coil.createMany({
    data: coils,
    skipDuplicates: true
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());