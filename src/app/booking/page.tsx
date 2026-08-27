import Link from "next/link";
import { redirect } from "next/navigation";
import { ActionButtons } from "@/components/booking/action-buttons";
import { ContactSupport } from "@/components/booking/contact-support";
import { DiagnosisBanner } from "@/components/booking/diagnosis-banner";
import { Timeline } from "@/components/booking/timeline";
import { diagnose, findBooking } from "@/lib/bookings";
import { readBookingSession } from "@/lib/bookings/session";

export const dynamic = "force-dynamic";

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
  const diagnosis = diagnose(booking);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="text-sm text-neutral-600 hover:text-neutral-900">
        ← Back
      </Link>

      <header className="mt-6 mb-8">
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

      <div className="grid gap-10">
        <DiagnosisBanner diagnosis={diagnosis} />
        <ActionButtons
          actions={diagnosis.actions}
          orderNumber={order.orderNumber}
        />
        <Timeline events={events} cause={diagnosis.cause} />
        <ContactSupport orderNumber={order.orderNumber} />
      </div>
    </main>
  );
}
