import { Hono } from "hono";
import { cors } from "hono/cors";

import { createSwaggerUiHtml, openApiDocument } from "./docs/openapi";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";
import { authRoutes } from "./modules/auth/auth.routes";
import { marketplaceRoutes } from "./modules/marketplace/marketplace.routes";
import { producersRoutes } from "./modules/producers/producers.routes";
import type { AppBindings } from "./types/hono";
import { NIGERIAN_STATES } from "./utils/nigerian-states";
import { successResponse } from "./utils/response";

export const app = new Hono<AppBindings>();

app.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);

app.get("/", (context) =>
  successResponse(context, "market-place backend is running", {
    service: "market-place-backend",
    version: "1.0.0",
  }),
);

app.get("/health", (context) =>
  successResponse(context, "Service is healthy", {
    status: "ok",
  }),
);

app.get("/metadata/nigerian-states", (context) =>
  successResponse(context, "Nigerian states fetched successfully", {
    states: NIGERIAN_STATES,
  }),
);

app.get("/openapi.json", (context) => context.json(openApiDocument));
app.get("/docs", (context) =>
  context.html(createSwaggerUiHtml("/openapi.json")),
);
app.get("/docs/", (context) =>
  context.html(createSwaggerUiHtml("/openapi.json")),
);

app.route("/auth", authRoutes);
app.route("/producers", producersRoutes);
app.route("/marketplace", marketplaceRoutes);

app.notFound(notFoundHandler);
app.onError(errorHandler);

export default app;
