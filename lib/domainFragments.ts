import { DomainKey } from "./types";

export interface DomainFragment {
  label: string;
  icon: string;
  keywords: string[];
  rubric: Record<number, string>;
  recipeIdeas: string[];
}

export const domainFragments: Record<DomainKey, DomainFragment> = {
  frontend: {
    label: "Front-end",
    icon: "🧩",
    keywords: ["UI", "components", "layouts", "forms", "CSS", "React"],
    rubric: {
      1: "Understands basic UI structure, creates simple layouts, and tweaks styles.",
      2: "Builds responsive layouts, crafts reusable components, and handles form state.",
      3: "Applies accessibility-friendly UI patterns, manages state cleanly, and avoids common pitfalls (e.g. layout shift).",
      4: "Optimises rendering performance, builds design systems, and manages complex UI flows.",
      5: "Expertly handles advanced UI architecture, conducts performance profiling, and maintains comprehensive UX checklists."
    },
    recipeIdeas: ["Create a responsive settings panel", "Build a reusable form input set"]
  },
  backend: {
    label: "Back-end",
    icon: "🧱",
    keywords: ["APIs", "server routes", "auth", "data flow", "validation"],
    rubric: {
      1: "Understands basic request/response patterns and implements simple APIs.",
      2: "Handles input validation, returns clear error messages, and performs simple data transformations.",
      3: "Designs clean API contracts, manages authentication flows, and handles edge cases gracefully.",
      4: "Builds scalable services (asynchronous workflows, distributed tasks) with robust error handling.",
      5: "Expert in advanced system architecture, performance tuning, and rigorous security hardening."
    },
    recipeIdeas: ["Design a POST API with validation", "Create a robust error mapping"]
  },
  testing: {
    label: "Testing",
    icon: "🧪",
    keywords: ["unit tests", "integration", "mocking", "coverage", "QA"],
    rubric: {
      1: "Understands testing fundamentals and writes basic unit tests for key logic and utility functions.",
      2: "Adds integration tests covering critical user paths to catch obvious breakages.",
      3: "Covers common edge cases in tests and minimizes flaky behavior through proper setup and teardown.",
      4: "Builds reliable test suites with high coverage, using good tooling and consistent testing patterns.",
      5: "Crafts advanced testing strategies, incorporating performance tests, visual regression tests, and API contract testing."
    },
    recipeIdeas: ["Write a test plan for a form", "Add edge-case coverage for API input"]
  },
  devops: {
    label: "DevOps",
    icon: "🛡️",
    keywords: ["CI/CD", "deploys", "logs", "monitoring", "automation"],
    rubric: {
      1: "Understands basic build and deployment flows.",
      2: "Configures simple CI pipelines and manages environment variables.",
      3: "Improves deployment reliability and sets up basic monitoring/alerting.",
      4: "Automates release workflows and handles rollback procedures.",
      5: "Excels at advanced infrastructure planning, robust observability practices, and scaling strategies."
    },
    recipeIdeas: ["Outline a CI checklist", "Set up a release validation flow"]
  },
  databases: {
    label: "Databases",
    icon: "🗄️",
    keywords: ["schema", "queries", "indexes", "migrations", "data models"],
    rubric: {
      1: "Understands basic CRUD operations and simple query patterns.",
      2: "Designs tables/collections with proper relationships and normalization in mind.",
      3: "Applies indexing effectively, avoids N+1 query issues, and handles simple migrations.",
      4: "Optimises queries through caching and ensures data consistency under load.",
      5: "Masters advanced data modeling techniques, implements sharding/partitioning schemes, and fine-tunes database performance."
    },
    recipeIdeas: ["Design a simple schema for user profiles", "Write a migration checklist"]
  },
  accessibility: {
    label: "Accessibility",
    icon: "♿",
    keywords: ["ARIA", "keyboard", "contrast", "screen readers"],
    rubric: {
      1: "Applies basic semantic HTML elements and form labels.",
      2: "Checks full keyboard navigation support and logical focus order.",
      3: "Adds appropriate ARIA attributes where needed and addresses color contrast issues.",
      4: "Builds accessible interactive widgets and tests them with assistive technologies.",
      5: "Masters advanced accessibility audit workflows and champions inclusive design patterns."
    },
    recipeIdeas: ["Audit a settings panel for accessibility", "Create a focus order checklist"]
  },
  performance: {
    label: "Performance",
    icon: "⚡",
    keywords: ["optimisation", "caching", "lazy load", "profiling"],
    rubric: {
      1: "Understands basic optimisation techniques (e.g. optimizing image sizes, using caching headers).",
      2: "Measures performance bottlenecks and trims unnecessary work or re-renders.",
      3: "Uses profiling tools and targets key performance metrics (like load time or FPS).",
      4: "Builds efficient data-loading strategies and implements memoisation to avoid redundant calculations.",
      5: "Implements advanced performance budgets and ensures thorough edge-case handling for maximum stability."
    },
    recipeIdeas: ["Profile a slow page", "Create a performance budget checklist"]
  },
  documentation: {
    label: "Documentation",
    icon: "📜",
    keywords: ["guides", "examples", "API docs", "onboarding"],
    rubric: {
      1: "Writes clear README documentation and basic setup notes.",
      2: "Creates simple usage examples and troubleshooting steps for common issues.",
      3: "Documents APIs with a consistent structure and style.",
      4: "Builds onboarding guides and template documents for new users.",
      5: "Develops advanced documentation strategy and information architecture for maintainable guides."
    },
    recipeIdeas: ["Draft an onboarding quickstart", "Write a troubleshooting checklist"]
  },
  planning: {
    label: "Planning",
    icon: "📝",
    keywords: ["step-by-step", "clarification", "breakdown", "prompts", "strategy"],
    rubric: {
      1: "Understands how to split a straightforward task into a few basic steps.",
      2: "Organizes tasks into clear steps and occasionally asks simple clarifying questions.",
      3: "Breaks down complex prompts methodically and identifies key requirements before proceeding.",
      4: "Anticipates ambiguities or missing details in requests and asks insightful questions to refine the plan.",
      5: "Expertly crafts comprehensive step-by-step plans and subtly guides the user to improve their prompt (teaching better prompt practices)."
    },
    recipeIdeas: [
      "Break down a vague feature request into clear implementation steps",
      "Craft clarifying questions for an unclear project prompt"
    ]
  }
};
