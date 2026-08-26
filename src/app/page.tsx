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
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
        How can we help?
      </h1>
      <p className="mt-2 text-neutral-600">
        Find an answer, or look up your booking to fix it yourself.
      </p>

      <div className="mt-8">
        <SearchBar />
      </div>

      <section className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-500">
          Top questions
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {topQuestions.map((article) => (
            <li key={article.id}>
              <ArticleCard article={article} />
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-10 text-sm text-neutral-500">
        Showing help for customers.{" "}
        <Link href="/start" className="underline hover:text-neutral-900">
          Not you?
        </Link>
      </p>
    </main>
  );
}
