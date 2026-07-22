import app from "./app";
import config from "./config";

async function main() {}
try {
  app.listen(config.port, () => {
    console.log(`Server Is Running On Port : ${config.port} `);
  });
} catch (error) {
  console.log("error starting the server", error);
  process.exit(1);
}

main()
