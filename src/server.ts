import { serve } from "@hono/node-server";

import { env } from "./config/env";
import { prisma } from "./db/prisma";
import { app } from "./app";

const server = serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`market-place backend is running on http://localhost:${info.port}`);
  },
);

let isShuttingDown = false;

const shutdown = (signal: NodeJS.Signals) => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.log(`${signal} received, shutting down gracefully`);

  const forceShutdownTimer = setTimeout(() => {
    console.error("Graceful shutdown timed out, forcing exit");
    void prisma.$disconnect().finally(() => process.exit(1));
  }, 10000);

  forceShutdownTimer.unref();

  server.close(() => {
    clearTimeout(forceShutdownTimer);
    void prisma.$disconnect().finally(() => process.exit(0));
  });
};

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => shutdown(signal));
}
