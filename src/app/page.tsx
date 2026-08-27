import Link from "next/link";
import { redirect } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { SearchBar } from "@/components/search-bar";
import { listArticles } from "@/lib/articles";
import { getPersona } from "@/lib/persona";

export const dynamic = "force-dynamic";

export default async function Home() {

  const persona = await getPersona();

  if (!persona) {
    redirect("/start");
  }

  const topQuestions = await listArticles({
    persona,
    pinnedOnly: true,
    limit: 6,
  });

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <section className="card p-8 sm:p-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">
          How can we help?
        </h1>
        <p className="mt-2 text-muted">
          Find an answer, or look up your booking to fix it yourself.
        </p>

        <div className="mt-7">
          <SearchBar />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="eyebrow">Top questions</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {topQuestions.map((article) => (
            <li key={article.id}>
              <ArticleCard article={article} />
            </li>
          ))}
        </ul>
      </section>

      <section className="card mt-6 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-bold text-ink">Already booked?</h2>
          <p className="mt-1 text-sm text-muted">
            Look up your order to see its status and fix it yourself.
          </p>
        </div>
        <Link href="/find-booking" className="btn btn-primary shrink-0">
          Find my booking
        </Link>
      </section>

      <p className="mt-8 text-sm text-faint">
        Showing help for customers.{" "}
        <Link
          href="/start"
          className="font-medium text-brand hover:text-brand-hover"
        >
          Not you?
        </Link>
      </p>
    </main>
  );
}
