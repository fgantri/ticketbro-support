"use client";

import { ACTIONS, type ActionId } from "@/lib/bookings/action-catalog";
import { HANDLERS } from "./action-handlers";

export function ActionButtons({
  actions,
  orderNumber,
}: {
  actions: ActionId[];
  orderNumber: string;
}) {
  if (actions.length === 0) return null;

  return (
    <section>
      <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-500">
        What you can do
      </h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {actions.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => void HANDLERS[id](orderNumber)}
            className="rounded-lg border border-neutral-200 p-4 text-left transition-colors hover:border-neutral-400"
          >
            <span className="font-medium text-neutral-900">
              {ACTIONS[id].label}
            </span>
            <span className="mt-1 block text-sm text-neutral-600">
              {ACTIONS[id].description}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
