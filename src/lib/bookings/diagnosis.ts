import type { EventType, OrderEvent } from "@/lib/db/schema";

export type Diagnosis = {
  id: string;
  title: string;
  detail: string;
  cause: EventType | null;
};

export function diagnose(events: OrderEvent[]): Diagnosis {
  const has = (type: EventType) => events.some((event) => event.type === type);

  if (has("event_cancelled")) {
    return {
      id: "event_cancelled",
      title: "The event was cancelled",
      detail:
        "The organiser cancelled this event. The shop refunds it through the payment method you used.",
      cause: "event_cancelled",
    };
  }

  if (has("payment_failed")) {
    return {
      id: "payment_failed",
      title: "The payment did not go through",
      detail:
        "No tickets were issued because the payment failed. Book again or use a different payment method.",
      cause: "payment_failed",
    };
  }

  if (has("mail_bounced")) {
    return {
      id: "delivery_failed",
      title: "The ticket mail could not be delivered",
      detail:
        "The tickets were sent, but the address rejected them. Correct the address and have them sent again.",
      cause: "mail_bounced",
    };
  }

  if (has("refund_requested")) {
    return {
      id: "refund_pending",
      title: "Your refund request is with the shop",
      detail:
        "The shop decides about the refund and you get the decision by email.",
      cause: "refund_requested",
    };
  }

  if (has("event_rescheduled")) {
    return {
      id: "event_rescheduled",
      title: "The event was moved",
      detail: "Your tickets stay valid for the new date, no action needed.",
      cause: "event_rescheduled",
    };
  }

  if (has("payment_pending") && !has("payment_confirmed")) {
    return {
      id: "payment_pending",
      title: "We are still waiting for your payment",
      detail:
        "Tickets are sent as soon as the payment is confirmed. Bank transfers can take up to two business days.",
      cause: "payment_pending",
    };
  }

  if (has("tickets_sent")) {
    return {
      id: "delivered",
      title: "Your tickets were sent",
      detail:
        "Check your inbox and the spam folder. You can have them sent again at any time.",
      cause: "tickets_sent",
    };
  }

  return {
    id: "in_progress",
    title: "Your booking is being processed",
    detail: "Nothing went wrong so far — the tickets are on their way.",
    cause: null,
  };
}
