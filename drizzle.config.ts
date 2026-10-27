import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dbCredentials: {
    url: "./data/gutenberg.sqlite",
  },
  dialect: "sqlite",
  out: "./drizzle",
  schema: "./src/db/schema.ts",
});
