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

  const characterSheetJson = JSON.stringify(
    {
      ...sheet,
      domains
    },
    null,
    2
  );

  const instructionTemplate = `You are a SKILL author for an AI agent.

Return ONLY the contents of a valid SKILL.md file (no commentary, no backticks around the whole file, no extra text before or after).

Creativity + tone:
- Write with a creativity level consistent with temperature={{temperature}} (lower = stricter, higher = more varied).
- Match the tone: {{tone}}.

Hard format requirements (must follow exactly):
1) Output a single SKILL.md document.
2) Begin with YAML front matter:
---
name: <kebab-case short name>
description: <concise description that includes when to use + triggers>
---
3) Then Markdown body in this exact order:
- Role/Persona line (plain text, starts with: "You are a ...")
- "## When to use" (bullets; include keywords/triggers)
- "## Teach & Learn"
- Domain sections ONLY for domains with level > 0 (clear headings, one per domain)
- "## Recipes" (at least 1 small example overall)
- "## Out of scope / Don'ts" (what this skill should not do)

Teach & Learn requirements:
- Explain the key ideas in plain language (avoid jargon unless necessary).
- Explain why the guidance is structured this way and how to apply it.
- Include a short RPG-flavoured analogy tied to the highest-level domain or overall skill theme.
- Include a "Try it now" mini-exercise (1–3 steps).
- Include "If you want more depth" (3–5 follow-up prompts the user can ask).

Domain section requirements:
- Only include domains provided in the Character Sheet.
- Scale depth by level:
  - Level 1: fundamentals + basic patterns
  - Level 2–3: solid practices, common pitfalls, trade-offs
  - Level 4–5: advanced techniques, edge cases, heuristics/checklists
- Be concrete and actionable (prefer do-this / avoid-that over theory).
- Use short paragraphs and bullet lists for readability.

Recipes requirements:
- Use scenarios from the top 1–2 domains if provided; otherwise use a general skill-crafting scenario.
- Keep recipes practical, small, and reproducible.

General constraints:
- Stay skimmable (headings, bullets, short sections).
- No filler, no repetition, no vague advice.
- Do not invent new domains, levels, tools, APIs, repos, or requirements not present in the Character Sheet.
- Do not reveal or restate the Character Sheet JSON verbatim.

Self-review (internal, do NOT print):
- Silently check: YAML valid; all required sections present and in order; every selected domain included once; at least one recipe; tone matches; examples are practical; no extra text outside SKILL.md.
- If anything is missing or weak, revise internally, then output the final SKILL.md.

Character Sheet (use as source of truth):
{{character_sheet_json}}
`;

  return instructionTemplate
    .replaceAll("{{temperature}}", String(sheet.temperature))
    .replaceAll("{{tone}}", sheet.style.tone)
    .replaceAll("{{character_sheet_json}}", characterSheetJson)
    .trim();
}
