import type { NextRequest } from "next/server";
import { listArticles } from "@/lib/articles";
import { PERSONAS, type Persona } from "@/lib/db/schema";

const isPersona = (value: string): value is Persona =>
  (PERSONAS as readonly string[]).includes(value);

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const persona = params.get("persona") ?? undefined;
  if (persona !== undefined && !isPersona(persona)) {
    return Response.json(
      { error: `persona must be one of: ${PERSONAS.join(", ")}` },
      { status: 400 },
    );
  }

  const limitParam = params.get("limit");
  const limit = limitParam === null ? undefined : Number(limitParam);
  if (limit !== undefined && (!Number.isInteger(limit) || limit < 1)) {
    return Response.json(
      { error: "limit must be a positive integer" },
      { status: 400 },
    );
  }

  const articles = await listArticles({
    persona,
    pinnedOnly: params.has("top") && params.get("top") !== "false",
    limit,
  });

  return Response.json({ articles });
}
