import Link from "next/link";
import { redirect } from "next/navigation";

const FIELD =
  "mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-neutral-900 focus:border-neutral-900 focus:outline-none";

export default async function FindBookingPage({
  searchParams,
}: PageProps<"/find-booking">) {
  const { error } = await searchParams;

  async function findBooking() {
    "use server";
    redirect("/find-booking?error=1");
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="text-sm text-neutral-600 hover:text-neutral-900">
        ← Back
      </Link>

      <h1 className="mt-6 text-2xl font-semibold tracking-tight text-neutral-900">
        Find my booking
      </h1>
      <p className="mt-2 text-neutral-600">
        Enter your order number and the email address you booked with. No
        account needed.
      </p>

      <form action={findBooking} className="mt-8 max-w-sm">
        <label className="block text-sm font-medium text-neutral-900">
          Order number
          <input name="orderNumber" required className={FIELD} />
        </label>

        <label className="mt-4 block text-sm font-medium text-neutral-900">
          Email address
          <input type="email" name="email" required className={FIELD} />
        </label>

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-700">
            No booking found for this combination.
          </p>
        )}

        <button
          type="submit"
          className="mt-6 rounded-lg bg-neutral-900 px-5 py-2.5 font-medium text-white transition-colors hover:bg-neutral-700"
        >
          Find booking
        </button>
      </form>
    </main>
  );
}
