import type { Order, OrderEvent, Shop } from "@/lib/db/schema";

export type Booking = { order: Order; shop: Shop; events: OrderEvent[] };
