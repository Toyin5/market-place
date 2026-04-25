const rawCorsOrigin = process.env.CORS_ORIGIN?.trim() || "*";

export const corsOrigins =
  rawCorsOrigin === "*"
    ? "*"
    : rawCorsOrigin
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);
