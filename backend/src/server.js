import env from "../src/config/env.js";
import app from "./app.js";

const server = app.listen(env.PORT, () => {
  console.log("Server started");
});

const connections = new Set();
server.on("connection", (conn) => {
  connections.add(conn);
  conn.on("close", () => connections.delete(conn));
});

let isShuttingDown = false;
const SHUTDOWN_TIMEOUT_MS = 8_000;

async function closeDependencies() {} // later use

async function shutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`Received ${signal}, shutting down gracefully...`);
  const forceExitTimer = setTimeout(() => process.exit(1), SHUTDOWN_TIMEOUT_MS);
  forceExitTimer.unref();
  server.close(async (err) => {
    if (err) {
      console.log("Error closing server:", err);
    } else {
      console.log("server closed");
    }
    try {
      await closeDependencies();
      clearTimeout(forceExitTimer);
      process.exit(err ? 1 : 0);
    } catch (err) {
      console.log("Error closing dependencies:", err);
      process.exit(1);
    }
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("uncaughtException", () => shutdown("uncaughtException"));
