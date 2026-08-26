import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db, DB_FILE } from "./index";
import { articles, type NewArticle } from "./schema";

const SEED_ARTICLES: NewArticle[] = [
  {
    id: "art_001",
    slug: "ticket-not-received",
    title: "I didn't receive my ticket",
    summary:
      "Where the ticket mail usually gets stuck and how to have it sent again.",
    body: "Tickets are sent as a PDF right after the payment is confirmed. If nothing arrived, the mail is usually in the spam folder or the address has a typo. Look up your booking with the order number and the email you used, then resend the tickets to the address on file or correct the address first.",
    topic: "delivery",
    persona: "customer",
    homeRank: 1,
  },
  {
    id: "art_002",
    slug: "wrong-email-address",
    title: "I entered the wrong email address",
    summary: "Correct the delivery address and get the tickets resent.",
    body: "You can change the email address on a booking yourself. For security the new address has to confirm the change through a verification link before any ticket is delivered to it, and the old address is notified that the change happened.",
    topic: "changes",
    persona: "customer",
    homeRank: 2,
  },
  {
    id: "art_003",
    slug: "payment-taken-no-confirmation",
    title: "Money was taken but I got no confirmation",
    summary: "What a pending payment means and how long it takes to settle.",
    body: "Some payment methods reserve the amount before the payment is finally confirmed. Until the confirmation reaches us, the booking stays pending and no tickets are sent. Most reservations settle within a few minutes; bank transfers can take up to two business days.",
    topic: "payment",
    persona: "customer",
    homeRank: 3,
  },
  {
    id: "art_004",
    slug: "cancel-and-refund",
    title: "Can I cancel my booking and get a refund?",
    summary: "Who decides about a refund and how long the decision takes.",
    body: "Refunds are decided by the shop that sold the ticket, not by the platform. You can request a cancellation from your booking page; it is handed to the provider with your order details attached and you get the decision by email.",
    topic: "refunds",
    persona: "customer",
    homeRank: 4,
  },
  {
    id: "art_005",
    slug: "event-cancelled-or-moved",
    title: "My event was cancelled or moved",
    summary: "What happens to your ticket when the organiser changes the date.",
    body: "If an organiser cancels or reschedules, the tickets you hold stay valid for the new date unless the organiser says otherwise. Cancellations are refunded by the organiser through the original payment method.",
    topic: "event",
    persona: "customer",
    homeRank: 5,
  },
  {
    id: "art_006",
    slug: "download-receipt",
    title: "I need an invoice or receipt",
    summary: "Download the receipt for a booking as a PDF.",
    body: "Every confirmed booking has a receipt with the shop details, the price and the VAT breakdown. Open your booking page and download it directly as a PDF — no request to support needed.",
    topic: "invoices",
    persona: "customer",
    homeRank: 6,
  },
  {
    id: "art_007",
    slug: "ticket-name-change",
    title: "Can I transfer my ticket to someone else?",
    summary: "When a name on a ticket can still be changed.",
    body: "Whether a ticket is personalised is decided by the organiser. If it is not personalised, you can simply pass it on. If it is, the name can only be changed while the organiser still allows changes for that event.",
    topic: "changes",
    persona: "customer",
    homeRank: null,
  },
  {
    id: "art_008",
    slug: "payout-schedule",
    title: "When do I get paid out for my sales?",
    summary: "Payout rhythm and what delays a payout.",
    body: "Payouts run weekly for all bookings that have settled and are past the cancellation window. A missing or unverified bank account is the most common reason for a delayed payout.",
    topic: "payment",
    persona: "provider",
    homeRank: null,
  },
];

migrate(db, { migrationsFolder: "drizzle" });

// idempotent re-seeding 
db.delete(articles).run(); 
db.insert(articles).values(SEED_ARTICLES).run();

console.log(`Seeded ${SEED_ARTICLES.length} articles into ${DB_FILE}`);
