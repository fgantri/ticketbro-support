import Link from "next/link";
import { listArticles } from "@/lib/articles";

// Articles come from the database, which Next cannot see changing at build
// time. Render per request so a reseed or an edit shows up immediately.
export const dynamic = "force-dynamic";

export default async function Home() {
  const topQuestions = await listArticles({
    persona: "customer",
    pinnedOnly: true,
    limit: 6,
  });

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
        How can we help?
      </h1>
      <p className="mt-2 text-neutral-600">
        Find an answer, or look up your booking to fix it yourself.
      </p>

      <section className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-500">
          Top questions
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {topQuestions.map((article) => (
            <li key={article.id}>
              <Link
                href={`/articles/${article.slug}`}
                className="block h-full rounded-lg border border-neutral-200 p-4 transition-colors hover:border-neutral-400"
              >
                <span className="font-medium text-neutral-900">
                  {article.title}
                </span>
                <span className="mt-1 block text-sm text-neutral-600">
                  {article.summary}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
