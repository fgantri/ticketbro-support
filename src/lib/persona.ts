import { cookies } from "next/headers";
import type { Persona } from "@/lib/db/schema";

export const PERSONA_COOKIE = "persona";
export const PERSONA_MAX_AGE = 60 * 60 * 24 * 30;

// provider self-service is out of scope for the MVP
export const SELECTABLE_PERSONAS = ["customer"] as const satisfies Persona[];

export function isSelectablePersona(value: unknown): value is Persona {
  return SELECTABLE_PERSONAS.some((persona) => persona === value);
}

export async function getPersona(): Promise<Persona | null> {
  const value = (await cookies()).get(PERSONA_COOKIE)?.value;
  return isSelectablePersona(value) ? value : null;
}
