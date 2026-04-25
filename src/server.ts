import { serve } from "@hono/node-server";

import { env } from "./config/env";
import { app } from "./app";

serve({
  fetch: app.fetch,
  port: env.PORT,
});

console.log(`market-place backend is running on http://localhost:${env.PORT}`);
