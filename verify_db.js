import { PrismaClient } from "./generated/prisma/index.js";

const prisma = new PrismaClient();

async function run() {
  console.log("Connecting to the database and querying tables...");
  
  // Test connection and measure query response time
  const start = Date.now();
  const users = await prisma.user.findMany();
  const products = await prisma.product.findMany();
  const end = Date.now();

  console.log("🟢 Connection status: SUCCESSFUL");
  console.log(`⏱️  Response latency: ${end - start}ms`);
  console.log(`📊 Current record counts:`);
  console.log(`   - Users: ${users.length}`);
  console.log(`   - Products: ${products.length}`);
}

run()
  .catch((err) => {
    console.error("🔴 Connection status: FAILED");
    console.error(err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
