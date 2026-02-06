import { defineConfig } from "drizzle-kit";

import { Config, readConfig } from "./src/config"
const cfg : Config = readConfig()

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./src/lib/db/out",
  dialect: "postgresql",
  dbCredentials: {
    url: cfg.dbUrl,
  },
});