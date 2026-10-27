import { createMcpHandler, McpServer } from "@modelcontextprotocol/server";
import { toStandardJsonSchema } from "@valibot/to-json-schema";
import {
  integer,
  maxLength,
  maxValue,
  minLength,
  minValue,
  number,
  object,
  optional,
  pipe,
  string,
} from "valibot";

import type { BookQueries } from "@/db/queries/books.ts";
import type { PassageQueries } from "@/db/queries/passages.ts";

const searchBooksInput = object({
  limit: optional(pipe(number(), integer(), minValue(1), maxValue(20)), 10),
  q: pipe(string(), minLength(1), maxLength(200)),
});

const getBookInput = object({
  bookId: pipe(number(), integer(), minValue(1)),
});

const searchTextInput = object({
  bookId: pipe(number(), integer(), minValue(1)),
  limit: optional(pipe(number(), integer(), minValue(1), maxValue(20)), 8),
  q: pipe(string(), minLength(1), maxLength(500)),
});

const readInput = object({
  bookId: pipe(number(), integer(), minValue(1)),
  context: optional(pipe(number(), integer(), minValue(0), maxValue(10)), 2),
  passageId: pipe(number(), integer(), minValue(1)),
});

export interface McpDependencies {
  books: BookQueries;
  passages: PassageQueries;
}

const json = <T>(value: T) => ({
  content: [
    {
      text: JSON.stringify(value),
      type: "text" as const,
    },
  ],
});

export const buildMcpServer = (deps: McpDependencies) => {
  const server = new McpServer({
    name: "gutenberg",
    version: "0.1.0",
  });

  server.registerTool(
    "gutenberg.search_books",
    {
      description:
        "Search books by title metadata. Returns metadata only; never returns book contents.",

      inputSchema: toStandardJsonSchema(searchBooksInput),

      title: "Search Gutenberg books",
    },

    async (args) => {
      const result = await deps.books.search(args.q, args.limit);

      return json({
        query: args.q,
        results: result,
      });
    }
  );

  server.registerTool(
    "gutenberg.get_book",
    {
      description:
        "Return book metadata and passage count without returning book contents.",

      inputSchema: toStandardJsonSchema(getBookInput),

      title: "Get Gutenberg book",
    },

    async ({ bookId }) => {
      const [book, passageCount] = await Promise.all([
        deps.books.getById(bookId),
        deps.books.countPassages(bookId),
      ]);

      return json({
        book,
        passageCount,
      });
    }
  );

  server.registerTool(
    "gutenberg.search_text",
    {
      description:
        "Search a book and return compact ranked snippets. Use gutenberg.read for surrounding text.",

      inputSchema: toStandardJsonSchema(searchTextInput),

      title: "Search inside a book",
    },

    async (args) => {
      const results = await deps.passages.search(
        args.bookId,
        args.q,
        args.limit
      );

      return json({
        bookId: args.bookId,
        query: args.q,
        results,
      });
    }
  );

  server.registerTool(
    "gutenberg.read",
    {
      description:
        "Read a passage plus a bounded amount of surrounding context.",

      inputSchema: toStandardJsonSchema(readInput),

      title: "Read a passage",
    },

    async (args) => {
      const result = await deps.passages.read(
        args.bookId,
        args.passageId,
        args.context
      );

      return json({
        bookId: args.bookId,
        passageId: args.passageId,
        passages: result,
      });
    }
  );

  return server;
};

export const createMcpServer = (deps: McpDependencies) =>
  createMcpHandler(() => buildMcpServer(deps));
