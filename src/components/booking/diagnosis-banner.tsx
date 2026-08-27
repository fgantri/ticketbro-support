import type { Diagnosis, Severity } from "@/lib/bookings";

const TONE: Record<Severity, string> = {
  ok: "border-emerald-300 bg-emerald-50",
  warn: "border-amber-300 bg-amber-50",
  blocked: "border-red-300 bg-red-50",
};

export function DiagnosisBanner({ diagnosis }: { diagnosis: Diagnosis }) {
  return (
    <section className={`rounded-lg border p-5 ${TONE[diagnosis.severity]}`}>
      <h2 className="font-medium text-neutral-900">{diagnosis.title}</h2>
      <p className="mt-1 text-sm text-neutral-700">{diagnosis.detail}</p>
    </section>
  );
}
