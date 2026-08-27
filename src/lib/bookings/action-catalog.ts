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
} satisfies Record<string, { label: string; description: string }>;

export type ActionId = keyof typeof ACTIONS;
