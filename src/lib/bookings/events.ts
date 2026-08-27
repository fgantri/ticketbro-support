import type { EventType, OrderEvent } from "@/lib/db/schema";

const DELIVERY = ["tickets_sent", "mail_bounced"] as const;
const PAYMENT = [
  "payment_pending",
  "payment_confirmed",
  "payment_failed",
] as const;

const latest = (events: OrderEvent[], types: readonly EventType[]) =>
  events.findLast((event) => types.includes(event.type));

export const lastDelivery = (events: OrderEvent[]) => latest(events, DELIVERY);

export const lastPayment = (events: OrderEvent[]) => latest(events, PAYMENT);

// Only for facts a later event cannot undo, for example: a cancelled event stays cancelled.
export const ever = (events: OrderEvent[], type: EventType) =>
  events.some((event) => event.type === type);
