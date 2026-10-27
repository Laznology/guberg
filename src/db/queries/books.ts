import { asc, count, eq, like } from "drizzle-orm";

import type { Database } from "@/db/index.ts";
import { books, passages } from "@/db/schema.ts";

export const createBookQueries = (db: Database) => ({
  async countPassages(bookId: number) {
    const result = await db
      .select({
        count: count(),
      })
      .from(passages)
      .where(eq(passages.bookId, bookId));

    return result[0]?.count ?? 0;
  },

  async getById(bookId: number) {
    const result = await db
      .select({
        author: books.author,
        id: books.id,
        language: books.language,
        sourceUrl: books.sourceUrl,
        textUrl: books.textUrl,
        title: books.title,
      })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    return result[0] ?? null;
  },

  async search(query: string, limit: number) {
    const pattern = `%${query}%`;

    return await db
      .select({
        author: books.author,
        id: books.id,
        language: books.language,
        title: books.title,
      })
      .from(books)
      .where(like(books.title, pattern))
      .orderBy(asc(books.title))
      .limit(limit);
  },
});

export type BookQueries = ReturnType<typeof createBookQueries>;
