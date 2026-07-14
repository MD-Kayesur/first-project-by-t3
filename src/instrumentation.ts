export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Dynamic import to avoid loading server code in edge environments if they exist
    await import("~/server/db");
  }
}
