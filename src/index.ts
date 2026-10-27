import { createApp } from "@/app.ts";

const app = createApp();

const port = Number(process.env.PORT ?? 3000);

export default {
  fetch: app.fetch,
  port,
};

console.log(`gutenberg-mcp → http://localhost:${port}`);
