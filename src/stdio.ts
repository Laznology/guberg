import { serveStdio } from "@modelcontextprotocol/server/stdio";

import { buildMcpServer } from "@/app.ts";
import { db } from "@/db/index.ts";
import { createBookQueries } from "@/db/queries/books.ts";
import { createPassageQueries } from "@/db/queries/passages.ts";

export const runStdio = () =>
  serveStdio(() =>
    buildMcpServer({
      books: createBookQueries(db),
      passages: createPassageQueries(db),
    })
  );

if (import.meta.main) {
  runStdio();
}
