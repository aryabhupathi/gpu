const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('Arya1234', 10);
  await prisma.user.upsert({
    where: { email: 'arya@arya.com' },
    update: {},
    create: {
      email: 'arya@arya.com',
      name: 'Arya',
      password: hash,
    },
  });
  console.log('User created!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
