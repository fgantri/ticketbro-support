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
      <h2 className="eyebrow">What you can do</h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {actions.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => void HANDLERS[id](orderNumber)}
            className="card-interactive cursor-pointer p-5 text-left"
          >
            <span className="font-bold text-ink">{ACTIONS[id].label}</span>
            <span className="mt-1 block text-sm text-muted">
              {ACTIONS[id].description}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
