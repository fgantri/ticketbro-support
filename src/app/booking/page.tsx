import Link from "next/link";
import { redirect } from "next/navigation";
import { diagnose, findBooking } from "@/lib/bookings";
import { readBookingSession } from "@/lib/bookings/session";
import type { EventType } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

const EVENT_LABELS: Record<EventType, string> = {
  order_placed: "Order placed",
  payment_pending: "Payment pending",
  payment_confirmed: "Payment confirmed",
  payment_failed: "Payment failed",
  tickets_sent: "Tickets sent",
  mail_bounced: "Ticket mail bounced",
  refund_requested: "Refund requested",
  event_rescheduled: "Event moved",
  event_cancelled: "Event cancelled",
};

const dateTime = new Intl.DateTimeFormat("de-DE", {
  dateStyle: "medium",
  timeStyle: "short",
});
const day = new Intl.DateTimeFormat("de-DE", { dateStyle: "long" });
const money = (cents: number, currency: string) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency }).format(
    cents / 100,
  );

export default async function BookingPage() {
  const session = await readBookingSession();

  if (!session) {
    redirect("/find-booking");
  }

  const booking = await findBooking(session.orderNumber, session.email);

  if (!booking) {
    redirect("/find-booking");
  }

  const { order, shop, events } = booking;
  const diagnosis = diagnose(events);
  const causeId = events.findLast(
    (event) => event.type === diagnosis.cause,
  )?.id;

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="text-sm text-neutral-600 hover:text-neutral-900">
        ← Back
      </Link>

      <header className="mt-6">
        <p className="text-sm text-neutral-500">
          {shop.name} · {order.orderNumber}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900">
          {order.product}
        </h1>
        <p className="mt-1 text-neutral-600">
          {day.format(order.eventDate)} ·{" "}
          {money(order.priceCents, order.currency)}
        </p>
      </header>

      <section className="mt-8 rounded-lg border border-neutral-300 bg-neutral-50 p-5">
        <h2 className="font-medium text-neutral-900">{diagnosis.title}</h2>
        <p className="mt-1 text-sm text-neutral-600">{diagnosis.detail}</p>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-500">
          Order history
        </h2>
        <ol className="mt-4 border-l border-neutral-200">
          {[...events].reverse().map((event) => (
            <li key={event.id} className="relative py-3 pl-5">
              <span
                className={`absolute -left-0.75 top-5 size-1.5 rounded-full ${
                  event.id === causeId ? "bg-neutral-900" : "bg-neutral-300"
                }`}
              />
              <p
                className={
                  event.id === causeId
                    ? "font-medium text-neutral-900"
                    : "text-neutral-700"
                }
              >
                {EVENT_LABELS[event.type]}
              </p>
              <p className="text-sm text-neutral-500">
                {dateTime.format(event.createdAt)}
                {event.detail && ` · ${event.detail}`}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
