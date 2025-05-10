import { PrismaClient } from "@prisma/client";
import { saltAndHashPassword } from "@/lib/password";

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  await prisma.user.deleteMany();

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "jerry",
        email: "jerry@foxmail.com",
        password: saltAndHashPassword("admin"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: "Xiao Ming",
        email: "xiaoming@example.com",
        password: saltAndHashPassword("password"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: "Xiao Hong",
        email: "xiaohong@example.com",
        password: saltAndHashPassword("password"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  ]);

  console.log("User data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
