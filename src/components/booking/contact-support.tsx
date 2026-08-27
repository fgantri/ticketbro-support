"use client";

import type { SubmitEvent } from "react";
import { describeBooking } from "@/app/booking/actions";

/**
 * The last step of the funnel, and the only one that costs an agent time. The
 * customer writes what they need; the order details, the diagnosis and the last
 * events are attached automatically — that is the whole point, so nobody has to
 * ask "what is your order number?" ever again.
 *
 * The demo shows the assembled case in an alert. A real implementation hands the
 * same data to a Server Action that creates the case and returns its number.
 */
export function ContactSupport({ orderNumber }: { orderNumber: string }) {
  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = String(
      new FormData(event.currentTarget).get("message") ?? "",
    ).trim();

    if (!message) return;

    // Same authentication as every action: the server re-reads the booking.
    const booking = await describeBooking(orderNumber);

    if (!booking) {
      window.alert("Your session expired. Please look up your booking again.");
      return;
    }

    window.alert(
      [
        `Support case · ${booking.orderNumber}`,
        "",
        message,
        "",
        `order:       ${booking.orderNumber}`,
        `email:       ${booking.email}`,
        `shop:        ${booking.shop}`,
        `product:     ${booking.product}`,
        `price:       ${booking.price}`,
        `diagnosis:   ${booking.diagnosis}`,
        `last events: ${booking.lastEvents.join(", ")}`,
        `device:      ${navigator.userAgent}`,
        "",
        "Not implemented — a Server Action would create the case from this.",
      ].join("\n"),
    );
  }

  return (
    <section>
      <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-500">
        None of this helped?
      </h2>
      <p className="mt-2 text-sm text-neutral-600">
        Describe what you need and we pass it on. Your order details, the
        diagnosis and the last events go with it — no need to repeat them.
      </p>

      <form onSubmit={submit} className="mt-4">
        <textarea
          name="message"
          rows={4}
          required
          placeholder="What should we look into?"
          className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
        />
        <button
          type="submit"
          className="mt-3 rounded-lg bg-neutral-900 px-5 py-2.5 font-medium text-white transition-colors hover:bg-neutral-700"
        >
          Send to support
        </button>
      </form>
    </section>
  );
}
