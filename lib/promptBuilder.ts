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
You are a SKILL author for an AI agent.

Return ONLY the contents of a valid SKILL.md file.
Do NOT include commentary, explanations, or metadata outside the file.

Creativity:
- Use a creativity level consistent with temperature=${sheet.temperature}.
  - Low temperature: concise, precise, opinionated.
  - High temperature: richer examples, analogies, and phrasing (no fluff).

Tone:
- Match the intent of sheet.style.tone (e.g. friendly, technical, playful, strict).

Format rules (mandatory):
- Output a SINGLE Markdown document.
- Begin with YAML front matter exactly in this form:
  ---
  name: <short kebab-case identifier>
  description: <concise description including when to use + keyword triggers>
  ---
- Follow with Markdown body using these exact headings and order:
  1. Role / Persona (single sentence starting with "You are a ...", plain text, not a heading)
  2. ## When to use
  3. ## Teach & Learn
  4. ## Domains
  5. ## Recipes
  6. ## Out of scope / Donts

Teach & Learn section (required):
- Explain the skill's core ideas in plain language (avoid jargon).
- Explain WHY the guidance is structured this way and HOW to apply it.
- Include a playful analogy tied to the highest-level domain.
- Include a short "Try it now" exercise (1-3 simple steps).
- Include an "If you want more depth" list (3-5 follow-up prompts the user can ask).
- If there are no domains selected, use a general analogy about skill-crafting.

Domains section:
- Create one subsection per domain with level > 0.
- Scale depth by level:
  - Level 1: fundamentals and vocabulary.
  - Level 3: solid practices, trade-offs, and common pitfalls.
  - Level 5: advanced techniques, checklists, edge cases, and heuristics.
- Be concrete and actionable; prefer guidance over theory.
- If no domains are selected, include a single bullet: "No domains selected."

Recipes section:
- Include at least ONE small, practical example.
- Choose examples ONLY from the top 1-2 domains listed in topDomains.
- If topDomains is empty, provide a general "skill writing" recipe that does not mention a domain.
- Recipes should be implementation-focused and realistic.

General constraints:
- Keep content skimmable and structured.
- Avoid filler, repetition, or generic advice.
- Do not reference internal variables, prompt mechanics, or this instruction.
- Do not invent domains or exceed the provided scope.
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
