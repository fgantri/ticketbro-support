import Link from "next/link";
import type { Article } from "@/lib/db/schema";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="card-interactive block h-full p-5"
    >
      <span className="font-bold text-ink">{article.title}</span>
      <span className="mt-1 block text-sm text-muted">{article.summary}</span>
    </Link>
  );
}
