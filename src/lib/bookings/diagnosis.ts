import type { EventType } from "@/lib/db/schema";
import { ever, lastDelivery, lastPayment } from "./events";
import type { ActionId } from "./action-catalog";
import type { Booking } from "./types";

export type Severity = "ok" | "warn" | "blocked";

export type Diagnosis = {
  id: string;
  severity: Severity;
  title: string;
  detail: string;
  /** Event type the timeline highlights as the reason for this diagnosis. */
  cause: EventType | null;
  /** Which actions this state should offer. */
  actions: ActionId[];
};

type Rule = {
  when: (booking: Booking, now: Date) => boolean;
  then: Diagnosis;
};

const RULES: Rule[] = [
  {
    when: ({ events }) => ever(events, "event_cancelled"),
    then: {
      id: "event_cancelled",
      severity: "blocked",
      title: "The event was cancelled",
      detail:
        "The organiser cancelled this event. The shop refunds it through the payment method you used.",
      cause: "event_cancelled",
      actions: ["download-receipt", "contact-support"],
    },
  },
  {
    when: ({ events }) => lastPayment(events)?.type === "payment_failed",
    then: {
      id: "payment_failed",
      severity: "blocked",
      title: "The payment did not go through",
      detail:
        "No tickets were issued because the payment failed. Book again or use a different payment method.",
      cause: "payment_failed",
      actions: ["contact-support"],
    },
  },
  {
    when: ({ events }) => lastPayment(events)?.type === "payment_pending",
    then: {
      id: "payment_pending",
      severity: "blocked",
      title: "We are still waiting for your payment",
      detail:
        "Tickets are sent as soon as the payment is confirmed. Bank transfers can take up to two business days.",
      cause: "payment_pending",
      actions: ["contact-support"],
    },
  },
  {
    when: ({ events }) => ever(events, "refund_requested"),
    then: {
      id: "refund_pending",
      severity: "warn",
      title: "Your refund request is with the shop",
      detail:
        "The shop decides about the refund and you get the decision by email.",
      cause: "refund_requested",
      actions: ["download-receipt", "contact-support"],
    },
  },
  {
    when: ({ order }, now) => order.eventDate < now,
    then: {
      id: "event_over",
      severity: "ok",
      title: "This event has already taken place",
      detail:
        "Nothing left to do here. You can still download the receipt for your records.",
      cause: null,
      actions: ["download-receipt"],
    },
  },
  {
    when: ({ events }) => lastDelivery(events)?.type === "mail_bounced",
    then: {
      id: "delivery_failed",
      severity: "warn",
      title: "The ticket mail could not be delivered",
      detail:
        "The tickets were sent, but the address rejected them. Most of the time there is a typo in it.",
      cause: "mail_bounced",
      actions: ["correct-email", "download-tickets"],
    },
  },
  {
    when: ({ events }) => ever(events, "event_rescheduled"),
    then: {
      id: "event_rescheduled",
      severity: "ok",
      title: "The event was moved",
      detail: "Your tickets stay valid for the new date, no action needed.",
      cause: "event_rescheduled",
      actions: ["download-tickets", "resend-tickets"],
    },
  },
  {
    when: ({ events }) => ever(events, "tickets_sent"),
    then: {
      id: "delivered",
      severity: "ok",
      title: "Your tickets were sent",
      detail:
        "Check your inbox and the spam folder. You can have them sent again at any time.",
      cause: "tickets_sent",
      actions: [
        "download-tickets",
        "resend-tickets",
        "correct-email",
        "download-receipt",
        "request-refund",
      ],
    },
  },
  {
    when: () => true, // default case
    then: {
      id: "in_progress",
      severity: "ok",
      title: "Your booking is being processed",
      detail: "Nothing went wrong so far — the tickets are on their way.",
      cause: null,
      actions: ["contact-support"],
    },
  },
];

export function diagnose(booking: Booking, now = new Date()): Diagnosis {
  return RULES.find((rule) => rule.when(booking, now))!.then;
}
