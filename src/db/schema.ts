import { sql } from "drizzle-orm";
import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const books = sqliteTable(
  "books",
  {
    author: text("author").notNull(),
    contentHash: text("content_hash"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    id: integer("id").primaryKey(),
    language: text("language"),
    sourceUrl: text("source_url").notNull(),
    textUrl: text("text_url").notNull(),
    title: text("title").notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
  },
  (table) => [
    index("books_author_idx").on(table.author),
    index("bookes_title_idx").on(table.title),
  ]
);

export const passages = sqliteTable(
  "passages",
  {
    body: text("body").notNull(),
    bookId: integer("book_id")
      .references(() => books.id, {
        onDelete: "cascade",
      })
      .notNull(),
    endOffset: integer("end_offset").notNull(),
    id: integer("id").primaryKey(),
    ordinal: integer("ordinal").notNull(),
    section: text("section"),
    startOffset: integer("start_offset").notNull(),
  },
  (table) => [
    uniqueIndex("passage_book_ordinal_unique").on(table.bookId, table.ordinal),
    index("passage_book_section_idx").on(table.bookId, table.section),
  ]
);
