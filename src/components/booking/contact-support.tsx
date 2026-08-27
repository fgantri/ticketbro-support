"use client";

import type { SubmitEvent } from "react";
import { describeBooking } from "@/app/booking/actions";

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
      <h2 className="eyebrow">None of this helped?</h2>

      <div className="card mt-4 p-6 sm:p-8">
        <p className="text-sm text-muted">
          Describe what you need and we pass it on. Your order details, the
          diagnosis and the last events go with it — no need to repeat them.
        </p>

        <form onSubmit={submit} className="mt-5">
          <textarea
            name="message"
            rows={4}
            required
            placeholder="What should we look into?"
            className="field resize-y"
          />
          <button
            type="submit"
            className="btn btn-primary mt-4 w-full sm:w-auto"
          >
            Send to support
          </button>
        </form>
      </div>
    </section>
  );
}
