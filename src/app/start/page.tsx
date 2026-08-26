import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Persona } from "@/lib/db/schema";
import {
  PERSONA_COOKIE,
  PERSONA_MAX_AGE,
  isSelectablePersona,
} from "@/lib/persona";

export default function StartPage() {
  
  async function choosePersona(formData: FormData) {
    "use server";

    const persona = formData.get("persona");

    if (!isSelectablePersona(persona)) {
      redirect("/start");
    }

    (await cookies()).set(PERSONA_COOKIE, persona, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: PERSONA_MAX_AGE,
    });

    redirect("/");
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
        Who are you?
      </h1>
      <p className="mt-2 text-neutral-600">
        Tell us how you use TicketBro and we&rsquo;ll show the help that fits.
      </p>

      <form action={choosePersona} className="mt-8 grid gap-3 sm:grid-cols-2">
        <PersonaCard
          persona="customer"
          title="I bought a ticket"
          description="Ticket not received, wrong email, refund or receipt."
        />
        <PersonaCard
          persona="provider"
          title="I sell tickets"
          description="Payouts, event setup and invoices."
          disabled
        />
      </form>
    </main>
  );
}

function PersonaCard({
  persona,
  title,
  description,
  disabled = false,
}: {
  persona: Persona;
  title: string;
  description: string;
  disabled?: boolean;
}) {
  const statusId = `${persona}-status`;

  return (
    <button
      type="submit"
      name="persona"
      value={persona}
      disabled={disabled}
      aria-describedby={disabled ? statusId : undefined}
      className={`flex h-full w-full flex-col rounded-lg border border-neutral-200 p-5 text-left transition-colors ${
        disabled
          ? "cursor-not-allowed border-dashed opacity-60"
          : "cursor-pointer hover:border-neutral-400"
      }`}
    >
      <span className="font-medium text-neutral-900">{title}</span>
      <span className="mt-1 text-sm text-neutral-600">{description}</span>
      {disabled && (
        <span
          id={statusId}
          className="mt-3 w-fit rounded border border-neutral-300 px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-neutral-500"
        >
          Coming soon
        </span>
      )}
    </button>
  );
}
