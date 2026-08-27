import { notFound } from "next/navigation";
import { BackLink } from "@/components/back-link";
import { getArticleBySlug } from "@/lib/articles";

export default async function ArticlePage({
  params,
}: PageProps<"/articles/[slug]">) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <BackLink />

      <article className="card mt-6 p-8 sm:p-10">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">
          {article.title}
        </h1>
        <p className="mt-6 leading-relaxed text-muted">{article.body}</p>
      </article>
    </main>
  );
}
