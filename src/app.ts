import { createMcpHonoApp } from "@modelcontextprotocol/hono";
import { bearerAuth } from "hono/bearer-auth";

import { db } from "@/db/index.ts";
import { createBookQueries } from "@/db/queries/books.ts";
import { createPassageQueries } from "@/db/queries/passages.ts";
import { createMcpServer } from "@/server.ts";
import type { McpDependencies } from "@/server.ts";

export {
  buildMcpServer,
  createMcpServer,
  type McpDependencies,
} from "@/server.ts";

export const createApp = (deps?: McpDependencies) => {
  const resolvedDeps: McpDependencies = deps ?? {
    books: createBookQueries(db),
    passages: createPassageQueries(db),
  };

  const handler = createMcpServer(resolvedDeps);
  const app = createMcpHonoApp();

  const apiToken = process.env.API_TOKEN;
  
  if (apiToken) {
    app.use("*", bearerAuth({ token: apiToken }));
  }
  
  app.all("*", (c) => {
    // SAFETY: createMcpHonoApp attaches parsedBody to context variables without generic typing.
    const vars = c.var as { parsedBody?: unknown };

    return handler.fetch(c.req.raw, {
      parsedBody: vars.parsedBody,
    });
  });

  return app;
};
