import Link from "next/link";
import type { Article } from "@/lib/db/schema";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="block h-full rounded-lg border border-neutral-200 p-4 transition-colors hover:border-neutral-400"
    >
      <span className="font-medium text-neutral-900">{article.title}</span>
      <span className="mt-1 block text-sm text-neutral-600">
        {article.summary}
      </span>
    </Link>
  );
}
