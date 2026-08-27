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
    <main className="mx-auto max-w-3xl px-6 py-12">
      <section className="card p-8 sm:p-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">
          Who are you?
        </h1>
        <p className="mt-2 text-muted">
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
      </section>
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
      className={`flex h-full w-full flex-col rounded-2xl border p-5 text-left transition-colors ${
        disabled
          ? "cursor-not-allowed border-dashed border-line-strong opacity-60"
          : "cursor-pointer border-line hover:border-brand hover:bg-brand-soft"
      }`}
    >
      <span className="font-bold text-ink">{title}</span>
      <span className="mt-1 text-sm text-muted">{description}</span>
      {disabled && (
        <span className="eyebrow mt-3 w-fit rounded-md bg-canvas px-2 py-1 text-muted">
          <span id={statusId}>Coming soon</span>
        </span>
      )}
    </button>
  );
}
