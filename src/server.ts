import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";

async function main() {}
try {
  await prisma.$connect();
  console.log("Database Connect Successfully");

  app.listen(config.port, () => {
    console.log(`Server is Running On Port : ${config.port} `);
  });
} catch (error) {
  console.error(" Failed to start the server:", error);
  await prisma.$disconnect();
  process.exit(1);
}

main();
