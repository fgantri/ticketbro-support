import Link from "next/link";
import { redirect } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { BackLink } from "@/components/back-link";
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
    <main className="mx-auto max-w-3xl px-6 py-12">
      <BackLink />

      <div className="card mt-6 p-6 sm:p-8">
        <SearchBar defaultValue={query} />
      </div>

      {results.length > 0 ? (
        <ul className="mt-8 grid gap-3">
          {results.map((article) => (
            <li key={article.id}>
              <ArticleCard article={article} />
            </li>
          ))}
        </ul>
      ) : (
        // A dead end is what sends people to support, so offer the next step.
        <section className="card mt-8 p-8 text-center">
          <h1 className="text-lg font-bold text-ink">
            No article matches &ldquo;{query}&rdquo;
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Look up your booking instead — most problems can be fixed there
            without contacting support.
          </p>
          <Link href="/find-booking" className="btn btn-primary mt-6">
            Find my booking
          </Link>
        </section>
      )}
    </main>
  );
}
