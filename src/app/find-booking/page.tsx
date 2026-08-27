import { redirect } from "next/navigation";
import { BackLink } from "@/components/back-link";
import { findBooking } from "@/lib/bookings";
import { startBookingSession } from "@/lib/bookings/session";

export default async function FindBookingPage({
  searchParams,
}: PageProps<"/find-booking">) {
  const { error } = await searchParams;

  async function lookUpBooking(formData: FormData) {
    "use server";

    const orderNumber = String(formData.get("orderNumber") ?? "");
    const email = String(formData.get("email") ?? "");
    const booking = await findBooking(orderNumber, email);

    // One generic error — never hint which of the two was wrong.
    if (!booking) {
      redirect("/find-booking?error=1");
    }

    await startBookingSession(booking.order.orderNumber, booking.order.email);
    redirect("/booking");
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <BackLink />

      <section className="card mt-6 p-8 sm:p-10">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">
          Find my booking
        </h1>
        <p className="mt-2 text-muted">
          Enter your order number and the email address you booked with. No
          account needed.
        </p>

        <form action={lookUpBooking} className="mt-8 max-w-sm">
          <label className="block">
            <span className="text-sm font-semibold text-ink">Order number</span>
            <input 
              name="orderNumber" 
              required 
              className="field mt-1.5"
              placeholder="TB-100002"
            />
          </label>

          <label className="mt-5 block">
            <span className="text-sm font-semibold text-ink">
              Email address
            </span>
            <input
              type="email"
              name="email"
              required
              className="field mt-1.5"
              placeholder="you@example.com"
            />
          </label>

          {error && (
            <p
              role="alert"
              className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            >
              No booking found for this combination.
            </p>
          )}

          <button type="submit" className="btn btn-primary mt-6 w-full sm:w-auto">
            Find booking
          </button>
        </form>
      </section>
    </main>
  );
}
