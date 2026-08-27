import type { Diagnosis, Severity } from "@/lib/bookings";

const TONE: Record<Severity, { box: string; dot: string }> = {
  ok: { box: "border-emerald-200 bg-emerald-50", dot: "bg-emerald-500" },
  warn: { box: "border-amber-200 bg-amber-50", dot: "bg-amber-500" },
  blocked: { box: "border-red-200 bg-red-50", dot: "bg-red-500" },
};

export function DiagnosisBanner({ diagnosis }: { diagnosis: Diagnosis }) {
  const tone = TONE[diagnosis.severity];

  return (
    <section className={`flex gap-3 rounded-2xl border p-6 ${tone.box}`}>
      <span className={`mt-1.5 size-2.5 shrink-0 rounded-full ${tone.dot}`} />
      <div>
        <h2 className="font-bold text-ink">{diagnosis.title}</h2>
        <p className="mt-1 text-sm text-muted">{diagnosis.detail}</p>
      </div>
    </section>
  );
}
