"use server";

import { diagnose, findBooking } from "@/lib/bookings";
import { readBookingSession } from "@/lib/bookings/session";

export type BookingSummary = {
  orderNumber: string;
  email: string;
  shop: string;
  product: string;
  price: string;
  diagnosis: string;
  lastEvents: string[];
};

export async function describeBooking(
  orderNumber: string,
): Promise<BookingSummary | null> {
  const session = await readBookingSession();
  if (!session) return null;

  const booking = await findBooking(session.orderNumber, session.email);
  if (!booking || booking.order.orderNumber !== orderNumber) return null;

  const { order, shop, events } = booking;

  return {
    orderNumber: order.orderNumber,
    email: order.email,
    shop: shop.name,
    product: order.product,
    price: `${(order.priceCents / 100).toFixed(2)} ${order.currency}`,
    diagnosis: diagnose(booking).id,
    lastEvents: events.slice(-5).map((event) => event.type),
  };
}
