import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const PERSONAS = ["customer", "provider"] as const;

export const TOPICS = [
  "delivery",
  "payment",
  "changes",
  "refunds",
  "event",
  "invoices",
] as const;

export const articles = sqliteTable("articles", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  body: text("body").notNull(),
  topic: text("topic", { enum: TOPICS }).notNull(),
  persona: text("persona", { enum: PERSONAS }).notNull(),
  /**
   * Editorial position among the home page shortcuts. NULL means "not pinned";
   */
  homeRank: integer("home_rank"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
export type Persona = (typeof PERSONAS)[number];
export type Topic = (typeof TOPICS)[number];
