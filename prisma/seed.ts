import { PrismaClient } from "@prisma/client";
import { saltAndHashPassword } from "@/lib/password";

const prisma = new PrismaClient();

async function seedUsers() {
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

async function seedCategories() {
  const categoryNames = [
    "Cars and vehicles",
    "Comedy",
    "Education",
    "Gaming",
    "Entertainment",
    "Film and animation",
    "How-to and style",
    "Music",
    "News and politics",
    "People and blogs",
    "Pets and animals",
    "Science and technology",
    "Sports",
    "Travel and events",
  ];

  console.log("Seeding categories...");

  try {
    const values = categoryNames.map((name) => ({
      name,
      description: `Videos related to ${name.toLowerCase()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await prisma.category.createMany({
      data: values,
    });

    console.log("Categories seeded successfully!");
  } catch (error) {
    console.error("Error seeding categories: ", error);
    process.exit(1);
  }
}

async function main() {
  await seedUsers();
  await seedCategories();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
