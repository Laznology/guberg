import { eq, sql } from "drizzle-orm";

import type { Database } from "@/db/index.ts";
import { passages } from "@/db/schema.ts";

export const createPassageQueries = (db: Database) => ({
  async read(bookId: number, passageId: number, context: number) {
    const [target] = await db
      .select({
        ordinal: passages.ordinal,
      })
      .from(passages)
      .where(eq(passages.id, passageId))
      .limit(1);

    const ordinal = target?.ordinal;

    if (ordinal === undefined) {
      return [];
    }

    return db
      .select()
      .from(passages)
      .where(
        sql`
            ${passages.bookId} = ${bookId}
            AND ${passages.ordinal}
              BETWEEN ${ordinal - context}
              AND ${ordinal + context}
          `
      )
      .orderBy(passages.ordinal);
  },

  async search(bookId: number, query: string, limit: number) {
    const match = query
      .trim()
      .split(/\s+/u)
      .filter(Boolean)
      .map((token) => `"${token.replaceAll('"', '""')}"`)
      .join(" AND ");

    return await db.all<{
      bookId: number;
      ordinal: number;
      section: string | null;
      snippet: string;
      score: number;
    }>(
      sql`
          SELECT
            p.id AS passageId,
            p.book_id AS bookId,
            p.ordinal,
            p.section,

            snippet(
              passages_fts,
              0,
              '«',
              '»',
              '…',
              32
            ) AS snippet,

            bm25(passages_fts) AS score

          FROM passages_fts

          INNER JOIN passages p
            ON p.id = passages_fts.rowid

          WHERE
            p.book_id = ${bookId}
            AND passages_fts MATCH ${match}

          ORDER BY score

          LIMIT ${limit}
        `
    );
  },
});

export type PassageQueries = ReturnType<typeof createPassageQueries>;
