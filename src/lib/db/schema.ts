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

export const shops = sqliteTable("shops", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  supportEmail: text("support_email").notNull(),
});

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  email: text("email").notNull(),
  shopId: text("shop_id")
    .notNull()
    .references(() => shops.id),
  product: text("product").notNull(),
  eventDate: integer("event_date", { mode: "timestamp" }).notNull(),
  priceCents: integer("price_cents").notNull(),
  currency: text("currency").notNull().default("EUR"),
});

export const EVENT_TYPES = [
  "order_placed",
  "payment_pending",
  "payment_confirmed",
  "payment_failed",
  "tickets_sent",
  "mail_bounced",
  "refund_requested",
  "event_rescheduled",
  "event_cancelled",
] as const;

export const orderEvents = sqliteTable("order_events", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  type: text("type", { enum: EVENT_TYPES }).notNull(),
  detail: text("detail"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export type Shop = typeof shops.$inferSelect;
export type NewShop = typeof shops.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderEvent = typeof orderEvents.$inferSelect;
export type NewOrderEvent = typeof orderEvents.$inferInsert;
export type EventType = (typeof EVENT_TYPES)[number];
