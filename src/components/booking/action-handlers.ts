"use client";

import { describeBooking, type BookingSummary } from "@/app/booking/actions";
import { ACTIONS, type ActionId } from "@/lib/bookings/action-catalog";

export type ActionHandler = (orderNumber: string) => Promise<void>;

export const HANDLERS: Record<ActionId, ActionHandler> = {
  "resend-tickets": preview("resend-tickets", (booking) => [
    `send the tickets for ${booking.product} to ${booking.email}`,
    "append a tickets_sent event",
  ]),

  "correct-email": preview("correct-email", (booking) => [
    `ask for an address to replace ${booking.email}`,
    "mail a confirmation link there, notify the old address",
    `move ${booking.orderNumber} once the link is clicked`,
  ]),

  "request-refund": preview("request-refund", (booking) => [
    "ask for a reason",
    `hand ${booking.orderNumber} (${booking.price}) to ${booking.shop} to decide`,
    "append a refund_requested event",
  ]),

  "download-tickets": preview("download-tickets", (booking) => [
    `render the ticket PDF for ${booking.product}`,
    `serve it as tickets-${booking.orderNumber}.pdf`,
  ]),

  "download-receipt": preview("download-receipt", (booking) => [
    `render the receipt over ${booking.price} for ${booking.shop}`,
    `serve it as receipt-${booking.orderNumber}.pdf`,
  ]),

  "contact-support": preview("contact-support", (booking) => [
    "open the message form",
    `attach ${booking.orderNumber}, ${booking.email}, diagnosis ${booking.diagnosis}`,
    `attach the last events: ${booking.lastEvents.join(", ")}`,
  ]),
};

/** Fetches the booking, then reports what the real implementation would do. */
function preview(
  id: ActionId,
  steps: (booking: BookingSummary) => string[],
): ActionHandler {
  return async (orderNumber) => {
    const booking = await describeBooking(orderNumber);

    if (!booking) {
      window.alert("Your session expired. Please look up your booking again.");
      return;
    }

    window.alert(
      [
        `${ACTIONS[id].label} · ${id}`,
        "",
        ...steps(booking).map((step) => `→ ${step}`),
        "",
        "Not implemented",
      ].join("\n"),
    );
  };
}
