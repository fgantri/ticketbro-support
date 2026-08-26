import { and, asc, eq, isNotNull, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { articles, type Article, type Persona } from "@/lib/db/schema";
import { rankArticles } from "./search";

export type { Article, Persona, Topic } from "@/lib/db/schema";

export type ArticleFilter = {
  persona?: Persona;
  pinnedOnly?: boolean;
  limit?: number;
};

export async function listArticles({
  persona,
  pinnedOnly,
  limit,
}: ArticleFilter = {}): Promise<Article[]> {
  const query = db
    .select()
    .from(articles)
    .where(
      and(
        persona === undefined ? undefined : eq(articles.persona, persona),
        pinnedOnly ? isNotNull(articles.homeRank) : undefined,
      ),
    )
    // Pinned articles first in editorial order, everything else after.
    .orderBy(sql`${articles.homeRank} asc nulls last`, asc(articles.id));

  return limit === undefined ? query.all() : query.limit(limit).all();
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const [article] = await db
    .select()
    .from(articles)
    .where(eq(articles.slug, slug))
    .limit(1);

  return article ?? null;
}

export async function searchArticles(query: string): Promise<Article[]> {
  return rankArticles(await listArticles(), query);
}
