import Link from "next/link";
import { redirect } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { SearchBar } from "@/components/search-bar";
import { searchArticles } from "@/lib/articles";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";

  if (!query) {
    redirect("/");
  }

  const results = await searchArticles(query);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="text-sm text-neutral-600 hover:text-neutral-900">
        ← Back
      </Link>

      <div className="mt-6">
        <SearchBar defaultValue={query} />
      </div>

      {results.length > 0 ? (
        <ul className="mt-10 grid gap-3">
          {results.map((article) => (
            <li key={article.id}>
              <ArticleCard article={article} />
            </li>
          ))}
        </ul>
      ) : (
        // A dead end is what sends people to support, so offer the next step.
        <section className="mt-10 rounded-lg border border-neutral-200 p-6">
          <h1 className="font-medium text-neutral-900">
            No article matches &ldquo;{query}&rdquo;
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            Look up your booking instead — most problems can be fixed there
            without contacting support.
          </p>
          <Link
            href="/find-booking"
            className="mt-4 inline-block rounded-lg bg-neutral-900 px-5 py-2.5 font-medium text-white transition-colors hover:bg-neutral-700"
          >
            Find my booking
          </Link>
        </section>
      )}
    </main>
  );
}
