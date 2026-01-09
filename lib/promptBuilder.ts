import { CharacterSheet } from "./types";
import { domainFragments } from "./domainFragments";

export function buildPrompt(sheet: CharacterSheet): string {
  const domains = Object.entries(sheet.levels)
    .filter(([, level]) => level > 0)
    .map(([key, level]) => {
      const fragment = domainFragments[key as keyof typeof domainFragments];
      return {
        key,
        label: fragment.label,
        level,
        keywords: fragment.keywords,
        rubric: fragment.rubric[level] ?? fragment.rubric[1],
        recipeIdeas: fragment.recipeIdeas
      };
    });

  const instruction = `
You are a skill author. Return ONLY the SKILL.md content, no commentary.
Use a creativity level consistent with temperature=${sheet.temperature} (lower = stricter, higher = more varied).

Format requirements:
- Output a single SKILL.md document.
- Begin with YAML front matter:
  ---
  name: <kebab-case short name>
  description: <concise, includes when to use + triggers>
  ---
- Follow with Markdown body:
  - Role/Persona line ("You are a ...")
  - "When to use" bullets (keywords/triggers)
- Domain sections ONLY for domains with level > 0
- Guidance scaled by level:
    - Level 1: basics
    - Level 3: solid practices + common pitfalls
    - Level 5: advanced + checklists + edge cases
- Include at least 1 small "Recipe" example overall, chosen from the top 1-2 domains listed in topDomains
- Include a short "Out of scope / Don'ts" section
`;

  return [
    instruction.trim(),
    "",
    "Character Sheet JSON:",
    JSON.stringify(
      {
        ...sheet,
        domains
      },
      null,
      2
    )
  ].join("\n");
}
