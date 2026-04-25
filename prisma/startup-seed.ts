import "dotenv/config";

import { PrismaClient } from "@prisma/client";

import { seedDatabase } from "./seed";

const prisma = new PrismaClient();

async function main() {
  const userCount = await prisma.user.count();

  if (userCount > 0) {
    console.log(`Skipping seed because ${userCount} user record(s) already exist.`);
    return;
  }

  console.log("Database is empty. Running initial seed...");
  await seedDatabase(prisma);
}

main()
  .catch((error) => {
    console.error("Startup seed check failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
