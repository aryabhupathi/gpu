import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
prisma.user
  .update({ where: { email: "arya@arya.com" }, data: { role: "ADMIN" } })
  .then(() => console.log("Made Arya admin"))
  .finally(() => prisma.$disconnect());
