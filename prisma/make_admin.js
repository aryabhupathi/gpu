const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("Arya1234", 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: "arya@arya.com" },
    update: { 
      role: "ADMIN",
      password: password
    },
    create: {
      name: "Arya Admin",
      email: "arya@arya.com",
      password: password,
      role: "ADMIN",
      level: 99,
      xp: 10000,
      badges: "👑 Legend,🛡️ Admin"
    },
  });

  console.log("Admin user secured:", adminUser.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
