import Link from "next/link";
import { notFound } from "next/navigation";
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
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="text-sm text-neutral-600 hover:text-neutral-900">
        ← Back
      </Link>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight text-neutral-900">
        {article.title}
      </h1>
      <p className="mt-6 leading-relaxed text-neutral-700">{article.body}</p>
    </main>
  );
}
