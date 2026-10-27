CREATE TABLE `books` (
	`id` integer PRIMARY KEY,
	`title` text NOT NULL,
	`author` text NOT NULL,
	`language` text,
	`source_url` text NOT NULL,
	`text_url` text NOT NULL,
	`content_hash` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `passages` (
	`id` integer PRIMARY KEY,
	`book_id` integer NOT NULL,
	`ordinal` integer NOT NULL,
	`section` text,
	`body` text NOT NULL,
	`start_offset` integer NOT NULL,
	`end_offset` integer NOT NULL,
	CONSTRAINT `fk_passages_book_id_books_id_fk` FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE INDEX `books_author_idx` ON `books` (`author`);--> statement-breakpoint
CREATE INDEX `bookes_title_idx` ON `books` (`title`);--> statement-breakpoint
CREATE UNIQUE INDEX `passage_book_ordinal_unique` ON `passages` (`book_id`,`ordinal`);--> statement-breakpoint
CREATE INDEX `passage_book_section_idx` ON `passages` (`book_id`,`section`);