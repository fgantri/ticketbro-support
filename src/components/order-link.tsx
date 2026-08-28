import Link from "next/link";
import { readBookingSession } from "@/lib/bookings/session";

export async function OrderLink({
  title = "Already booked?",
}: {
  title?: string;
}) {
  const session = await readBookingSession();

  return (
    <section className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-bold text-ink">{title}</h2>
        <p className="mt-1 text-sm text-muted">
          {session
            ? `Order ${session.orderNumber} — see its status and fix it yourself.`
            : "Look up your order to see its status and fix it yourself."}
        </p>
      </div>
      <Link
        href={session ? "/booking" : "/find-booking"}
        className="btn btn-primary shrink-0"
      >
        {session ? "Open my booking" : "Find my booking"}
      </Link>
    </section>
  );
}
