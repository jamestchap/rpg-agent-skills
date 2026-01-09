# RPG Skill Forge

RPG Skill Forge is a local-first MVP that helps you level up an agent profile and generate a `SKILL.md` file for OpenAI Codex skills and Claude skills.

## Features

- RPG-style domain cards (Front-end, Back-end, Testing, DevOps, Databases, Accessibility, Performance, Documentation).
- Points remaining indicator with adjustable total.
- Character summary with class name + flavour text.
- Model settings for Ollama or OpenRouter.
- Auto or manual temperature mode.
- One-click SKILL.md generation with validation feedback.

## Getting started

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Then open `http://localhost:3000`.

## Ollama setup

Install and run Ollama:

```bash
ollama serve
ollama pull llama3.1:8b
```

Use the model name in the UI. The default URL is `http://localhost:11434`.

## OpenRouter setup

- Create an OpenRouter API key.
- Paste it into the UI (optionally remember it locally).
- Choose a model like `anthropic/claude-3.5-sonnet`.

API keys are not stored on the server.

## SKILL.md usage

1. Generate a SKILL.md file in the UI.
2. Save it to a folder on your machine (e.g. `my-skills/skill.md`).
3. Follow your agent tooling instructions to install or reference the skill.

## Project structure

- `app/page.tsx`: main UI.
- `components/rpg`: RPG UI components.
- `lib`: prompt builder, domain fragments, temperature logic.
- `app/api/generate-skill/route.ts`: Ollama/OpenRouter adapter.
- `examples/sample-skill.md`: example output.

## How to test generation

1. Run the dev server: `npm run dev`
2. Open `http://localhost:3000`
3. Choose a provider (Ollama or OpenRouter), model, and temperature mode.
4. Click **Generate SKILL.md**.
5. Confirm the validation line shows ✅ “Valid YAML header found.”

## Testing

No automated tests yet.

## Quick commands and key files (summary)

Commands:
- `npm install`
- `npm run dev`

Key files:
- `app/page.tsx` (main UI)
- `components/rpg/*` (domain cards, summary, settings, output)
- `app/api/generate-skill/route.ts` (provider adapter)
- `lib/*` (prompt builder, domain fragments, temperature logic)
