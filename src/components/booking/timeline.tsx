import type { EventType, OrderEvent } from "@/lib/db/schema";

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

export function Timeline({
  events,
  cause,
}: {
  events: OrderEvent[];
  cause: EventType | null;
}) {
  const highlightId = events.findLast((event) => event.type === cause)?.id;

  return (
    <section>
      <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-500">
        Order history
      </h2>

      <ol className="mt-4 border-l border-neutral-200">
        {[...events].reverse().map((event) => {
          const highlighted = event.id === highlightId;

          return (
            <li key={event.id} className="relative py-3 pl-5">
              <span
                className={`absolute -left-0.75 top-5 size-1.5 rounded-full ${
                  highlighted ? "bg-neutral-900" : "bg-neutral-300"
                }`}
              />
              <p
                className={
                  highlighted
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
          );
        })}
      </ol>
    </section>
  );
}
