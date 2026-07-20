import { db } from "./src/server/db";
async function main() {
  try {
    const user = await db.user.create({
      data: {
        name: "Test",
        email: "test2@example.com",
        password: "hashedpassword",
      }
    });
    console.log("Success:", user);
  } catch (e) {
    console.error("Error:", e);
  }
}
main();
