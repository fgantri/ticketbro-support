import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db, DB_FILE } from "./index";
import {
  articles,
  orderEvents,
  orders,
  type EventType,
  type NewArticle,
  type NewOrder,
  type NewShop,
  shops,
} from "./schema";

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

const SEED_SHOPS: NewShop[] = [
  {
    id: "shop_tollwood",
    name: "Tollwood Tickets",
    supportEmail: "service@tollwood-tickets.example",
  },
  {
    id: "shop_backstage",
    name: "Backstage Halle",
    supportEmail: "hilfe@backstage-halle.example",
  },
  {
    id: "shop_elbphilharmonie",
    name: "Elbphilharmonie Shop",
    supportEmail: "tickets@elbphilharmonie-shop.example",
  },
  {
    id: "shop_opennord",
    name: "Open Air Nord",
    supportEmail: "kontakt@openairnord.example",
  },
];

type SeedOrder = {
  order: NewOrder;
  events: { type: EventType; hoursAgo: number; detail?: string }[];
};

const NOW = Date.now();
const timestamp = (hoursAgo: number) => new Date(NOW - hoursAgo * 3_600_000);
const inDays = (days: number) => new Date(NOW + days * 86_400_000);

const SEED_ORDERS: SeedOrder[] = [
  {
    order: {
      id: "ord_001",
      orderNumber: "TB-100001",
      email: "lena.mayer@example.com",
      shopId: "shop_tollwood",
      product: "Winterfestival — 2 tickets",
      eventDate: inDays(34),
      priceCents: 8900,
    },
    events: [
      { type: "order_placed", hoursAgo: 72 },
      { type: "payment_confirmed", hoursAgo: 72, detail: "Credit card" },
      {
        type: "tickets_sent",
        hoursAgo: 71,
        detail: "Sent to lena.mayer@example.com",
      },
    ],
  },
  {
    order: {
      id: "ord_002",
      orderNumber: "TB-100002",
      email: "jonas.k@exampl.com",
      shopId: "shop_backstage",
      product: "Kettcar live — 1 ticket",
      eventDate: inDays(12),
      priceCents: 4200,
    },
    events: [
      { type: "order_placed", hoursAgo: 50 },
      { type: "payment_confirmed", hoursAgo: 50, detail: "PayPal" },
      {
        type: "tickets_sent",
        hoursAgo: 49,
        detail: "Sent to jonas.k@exampl.com",
      },
      {
        type: "mail_bounced",
        hoursAgo: 49,
        detail: "Mailbox does not exist",
      },
    ],
  },
  {
    order: {
      id: "ord_003",
      orderNumber: "TB-100003",
      email: "s.hoffmann@example.com",
      shopId: "shop_elbphilharmonie",
      product: "Abendkonzert — 2 tickets",
      eventDate: inDays(58),
      priceCents: 15400,
    },
    events: [
      { type: "order_placed", hoursAgo: 20 },
      {
        type: "payment_pending",
        hoursAgo: 20,
        detail: "Bank transfer, not settled yet",
      },
    ],
  },
  {
    order: {
      id: "ord_004",
      orderNumber: "TB-100004",
      email: "m.bauer@example.com",
      shopId: "shop_backstage",
      product: "Indie Night — 3 tickets",
      eventDate: inDays(21),
      priceCents: 7500,
    },
    events: [
      { type: "order_placed", hoursAgo: 96 },
      { type: "payment_pending", hoursAgo: 96, detail: "Credit card" },
      { type: "payment_failed", hoursAgo: 92, detail: "Card declined" },
    ],
  },
  {
    order: {
      id: "ord_005",
      orderNumber: "TB-100005",
      email: "clara.wolf@example.com",
      shopId: "shop_opennord",
      product: "Sommerfest — 2 tickets",
      eventDate: inDays(90),
      priceCents: 11000,
    },
    events: [
      { type: "order_placed", hoursAgo: 240 },
      { type: "payment_confirmed", hoursAgo: 240, detail: "SEPA" },
      {
        type: "tickets_sent",
        hoursAgo: 239,
        detail: "Sent to clara.wolf@example.com",
      },
      {
        type: "event_cancelled",
        hoursAgo: 12,
        detail: "Organiser cancelled the event",
      },
    ],
  },
  {
    order: {
      id: "ord_006",
      orderNumber: "TB-100006",
      email: "t.richter@example.com",
      shopId: "shop_tollwood",
      product: "Comedy Abend — 1 ticket",
      eventDate: inDays(45),
      priceCents: 3200,
    },
    events: [
      { type: "order_placed", hoursAgo: 300 },
      { type: "payment_confirmed", hoursAgo: 300, detail: "Credit card" },
      {
        type: "tickets_sent",
        hoursAgo: 299,
        detail: "Sent to t.richter@example.com",
      },
      {
        type: "refund_requested",
        hoursAgo: 30,
        detail: "Waiting for the shop to decide",
      },
    ],
  },
  {
    order: {
      id: "ord_007",
      orderNumber: "TB-100007",
      email: "nina.br@example.com",
      shopId: "shop_opennord",
      product: "Frühlingslauf — 1 ticket",
      eventDate: inDays(120),
      priceCents: 2900,
    },
    events: [
      { type: "order_placed", hoursAgo: 400 },
      { type: "payment_confirmed", hoursAgo: 400, detail: "PayPal" },
      {
        type: "tickets_sent",
        hoursAgo: 399,
        detail: "Sent to nina.br@example.com",
      },
      {
        type: "event_rescheduled",
        hoursAgo: 48,
        detail: "Moved to a later date, tickets stay valid",
      },
    ],
  },
  {
    order: {
      id: "ord_008",
      orderNumber: "TB-100008",
      email: "p.schulz@example.com",
      shopId: "shop_opennord",
      product: "Jazznacht — 2 tickets",
      eventDate: inDays(-9),
      priceCents: 5400,
    },
    events: [
      { type: "order_placed", hoursAgo: 600 },
      { type: "payment_confirmed", hoursAgo: 600, detail: "SEPA" },
      {
        type: "tickets_sent",
        hoursAgo: 599,
        detail: "Sent to p.schulz@example.com",
      },
    ],
  },
];

migrate(db, { migrationsFolder: "drizzle" });

// idempotent re-seeding
db.delete(articles).run();
db.insert(articles).values(SEED_ARTICLES).run();

db.delete(orderEvents).run();
db.delete(orders).run();
db.delete(shops).run();
db.insert(shops).values(SEED_SHOPS).run();
db.insert(orders)
  .values(SEED_ORDERS.map((entry) => entry.order))
  .run();
db.insert(orderEvents)
  .values(
    SEED_ORDERS.flatMap(({ order, events }) =>
      events.map((event, i) => ({
        id: `${order.id}_e${i}`,
        orderId: order.id,
        type: event.type,
        detail: event.detail,
        createdAt: timestamp(event.hoursAgo),
      })),
    ),
  )
  .run();

console.log(
  `Seeded ${SEED_ARTICLES.length} articles, ${SEED_SHOPS.length} shops and ${SEED_ORDERS.length} orders into ${DB_FILE}`,
);
