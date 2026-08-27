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
      <h2 className="eyebrow">Order history</h2>

      <ol className="card mt-4 p-6">
        {[...events].reverse().map((event, index, all) => {
          const highlighted = event.id === highlightId;

          return (
            <li key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
              {index < all.length - 1 && (
                <span className="absolute left-[5px] top-3 bottom-0 w-px bg-line" />
              )}
              <span
                className={`relative mt-1.5 size-2.5 shrink-0 rounded-full ${
                  highlighted
                    ? "bg-brand ring-4 ring-brand-soft"
                    : "bg-line-strong"
                }`}
              />
              <div className="min-w-0">
                <p
                  className={
                    highlighted ? "font-bold text-brand" : "font-medium text-ink"
                  }
                >
                  {EVENT_LABELS[event.type]}
                </p>
                <p className="mt-0.5 text-sm text-faint">
                  {dateTime.format(event.createdAt)}
                  {event.detail && ` · ${event.detail}`}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
