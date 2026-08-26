import type { Article } from "@/lib/db/schema";

/** Filler words that carry no signal in a support query. */
const STOP_WORDS = new Set([
  "a", "an", "and", "any", "are", "at", "be", "been", "but", "can", "did",
  "do", "does", "for", "from", "get", "got", "has", "have", "how", "in",
  "is", "it", "its", "me", "my", "no", "not", "of", "on", "or", "so",
  "that", "the", "there", "this", "to", "was", "were", "what", "when",
  "where", "why", "will", "with", "you", "your",
]);

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

/**
 * Ranks articles by how many query tokens they contain, 
 * ignoring stop words and punctuation. 
 */
export function rankArticles(articles: Article[], query: string): Article[] {
  const tokens = tokenize(query);

  return articles
    .map((article) => {
      const text = `${article.title} ${article.body}`.toLowerCase();
      return { article, score: tokens.filter((t) => text.includes(t)).length };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ article }) => article);
}
