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
      1: "Understands basic UI structure, simple layouts, and can tweak styles.",
      2: "Builds responsive layouts, reusable components, and handles form states.",
      3: "Applies accessibility-friendly UI patterns, manages state cleanly, and avoids common pitfalls like layout shift.",
      4: "Optimises rendering, builds design systems, and manages complex UI flows.",
      5: "Advanced UI architecture, performance profiling, and comprehensive UX checklists."
    },
    recipeIdeas: ["Create a responsive settings panel", "Build a reusable form input set"]
  },
  backend: {
    label: "Back-end",
    icon: "🧱",
    keywords: ["APIs", "server routes", "auth", "data flow", "validation"],
    rubric: {
      1: "Knows basic request/response patterns and can wire a simple API.",
      2: "Handles input validation, error messages, and simple data transformations.",
      3: "Designs clean API contracts, manages auth flows, and handles edge cases.",
      4: "Builds scalable services, async workflows, and robust error handling.",
      5: "Advanced architecture, performance tuning, and security hardening."
    },
    recipeIdeas: ["Design a POST API with validation", "Create a robust error mapping"]
  },
  testing: {
    label: "Testing",
    icon: "🧪",
    keywords: ["unit tests", "integration", "mocking", "coverage", "QA"],
    rubric: {
      1: "Writes basic unit tests for key logic and utilities.",
      2: "Adds integration tests for critical user paths.",
      3: "Covers common edge cases and reduces flaky tests.",
      4: "Builds reliable test suites with good coverage and tooling.",
      5: "Advanced test strategy with performance, visual, and contract testing."
    },
    recipeIdeas: ["Write a test plan for a form", "Add edge-case coverage for API input"]
  },
  devops: {
    label: "DevOps",
    icon: "🛡️",
    keywords: ["CI/CD", "deploys", "logs", "monitoring", "automation"],
    rubric: {
      1: "Understands basic build and deploy flows.",
      2: "Configures simple CI checks and environment variables.",
      3: "Improves deployment reliability and monitoring.",
      4: "Automates release workflows and handles rollbacks.",
      5: "Advanced infra planning, observability, and scaling tactics."
    },
    recipeIdeas: ["Outline a CI checklist", "Set up a release validation flow"]
  },
  databases: {
    label: "Databases",
    icon: "🗄️",
    keywords: ["schema", "queries", "indexes", "migrations", "data models"],
    rubric: {
      1: "Understands basic CRUD and simple query patterns.",
      2: "Designs tables/collections with relationships in mind.",
      3: "Applies indexing, avoids N+1 issues, and handles migrations.",
      4: "Optimises queries, caching, and data consistency.",
      5: "Advanced modelling, sharding/partitioning, and performance tuning."
    },
    recipeIdeas: ["Design a simple schema for user profiles", "Write a migration checklist"]
  },
  accessibility: {
    label: "Accessibility",
    icon: "♿",
    keywords: ["ARIA", "keyboard", "contrast", "screen readers"],
    rubric: {
      1: "Applies basic semantic HTML and labels.",
      2: "Checks keyboard navigation and focus order.",
      3: "Adds ARIA where needed and addresses contrast issues.",
      4: "Builds accessible complex widgets with testing.",
      5: "Advanced audit workflows and inclusive design patterns."
    },
    recipeIdeas: ["Audit a settings panel for accessibility", "Create a focus order checklist"]
  },
  performance: {
    label: "Performance",
    icon: "⚡",
    keywords: ["optimisation", "caching", "lazy load", "profiling"],
    rubric: {
      1: "Understands basic optimisation like image sizes and caching headers.",
      2: "Measures bottlenecks and trims unnecessary work.",
      3: "Applies profiling tools and targets key metrics.",
      4: "Builds efficient data loading strategies and memoisation.",
      5: "Advanced performance budgets and edge case handling."
    },
    recipeIdeas: ["Profile a slow page", "Create a performance budget checklist"]
  },
  documentation: {
    label: "Documentation",
    icon: "📜",
    keywords: ["guides", "examples", "API docs", "onboarding"],
    rubric: {
      1: "Writes clear README updates and setup notes.",
      2: "Creates usage examples and troubleshooting steps.",
      3: "Documents APIs with consistent structure.",
      4: "Builds onboarding flows and templates.",
      5: "Advanced doc strategy and information architecture."
    },
    recipeIdeas: ["Draft an onboarding quickstart", "Write a troubleshooting checklist"]
  }
};
