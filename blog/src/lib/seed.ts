import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@blog.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@blog.com",
      password: hashedPassword,
    },
  });
  console.log("Seed complete: admin@blog.com / admin123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
