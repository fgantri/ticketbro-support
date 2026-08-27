import { and, asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  orderEvents,
  orders,
  shops,
  type Order,
  type OrderEvent,
  type Shop,
} from "@/lib/db/schema";

export type Booking = { order: Order; shop: Shop; events: OrderEvent[] };

export type { Diagnosis } from "./diagnosis";
export { diagnose } from "./diagnosis";

/** Order number plus email is the whole authentication — both must match. */
export async function findBooking(
  orderNumber: string,
  email: string,
): Promise<Booking | null> {
  const [row] = await db
    .select({ order: orders, shop: shops })
    .from(orders)
    .innerJoin(shops, eq(shops.id, orders.shopId))
    .where(
      and(
        eq(orders.orderNumber, orderNumber.trim().toUpperCase()),
        eq(orders.email, email.trim().toLowerCase()),
      ),
    )
    .limit(1);

  if (!row) return null;

  const events = await db
    .select()
    .from(orderEvents)
    .where(eq(orderEvents.orderId, row.order.id))
    .orderBy(asc(orderEvents.createdAt));

  return { ...row, events };
}
