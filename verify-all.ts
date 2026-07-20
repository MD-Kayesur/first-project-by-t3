import { db } from "./src/server/db.js";

async function main() {
  const result = await db.user.updateMany({
    where: { emailVerified: null },
    data: { emailVerified: new Date() },
  });
  console.log(`Verified ${result.count} existing users.`);
}
main();
