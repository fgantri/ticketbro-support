/**
 * Which self-service actions exist, and how they are named to the customer.
 *
 * This is the vocabulary the other two layers share without knowing each other:
 * `diagnosis.ts` names actions to offer per state, and `action-handlers.ts`
 * implements what they do. It holds no logic and no `"use server"` / `"use
 * client"` marking, so both sides can import it.
 *
 * `ActionId` is derived from the keys, so this object is the only list of ids
 * there is. Adding an entry makes `HANDLERS` incomplete until it gets a handler
 * — that is the compiler reminding you, not a rule to remember.
 */
export const ACTIONS = {
  "resend-tickets": {
    label: "Send the tickets again",
    description: "Goes to the address on file.",
  },
  "correct-email": {
    label: "Correct the email address",
    description: "The new address has to confirm before it gets anything.",
  },
  "request-refund": {
    label: "Request a cancellation",
    description: "The shop decides and answers by email.",
  },
  "download-tickets": {
    label: "Download the tickets",
    description: "Works right away, no mail involved.",
  },
  "download-receipt": {
    label: "Download the receipt",
    description: "Shop details, price and VAT breakdown.",
  },
  "contact-support": {
    label: "Contact support",
    description: "We attach the order details to your message.",
  },
} satisfies Record<string, { label: string; description: string }>;

export type ActionId = keyof typeof ACTIONS;
