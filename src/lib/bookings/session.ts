import { cookies } from "next/headers";

const COOKIE = "booking";
const MAX_AGE = 60 * 60;

export async function startBookingSession(orderNumber: string, email: string) {
  (await cookies()).set(COOKIE, `${orderNumber}|${email}`, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function readBookingSession() {
  const [orderNumber, email] =
    (await cookies()).get(COOKIE)?.value.split("|") ?? [];

  return orderNumber && email ? { orderNumber, email } : null;
}
