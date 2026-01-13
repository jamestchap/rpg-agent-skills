import { DomainKey, DomainLevelMap } from "./types";
import { domainFragments } from "./domainFragments";

const classTitles: Record<DomainKey, string> = {
  frontend: "Frontend Ranger",
  backend: "Backend Sentinel",
  testing: "Testing Alchemist",
  devops: "DevOps Warden",
  databases: "Database Sage",
  accessibility: "Accessibility Guardian",
  performance: "Performance Sprinter",
  documentation: "Documentation Bard",
  designer: "Design Crafter"
};

const classFlavour: Record<string, string> = {
  "Full-Stack Adventurer":
    "Balances both the front and back of the realm, keeping the whole journey smooth.",
  "Frontend Ranger":
    "Guides users through friendly interfaces and keeps the journey delightful.",
  "Backend Sentinel":
    "Holds the fort with reliable services and sturdy APIs.",
  "Testing Alchemist":
    "Turns fragile systems into steady results with careful checks.",
  "DevOps Warden":
    "Keeps deployments safe and the systems humming.",
  "Database Sage":
    "Guards the archives and keeps the data flowing cleanly.",
  "Accessibility Guardian":
    "Makes sure every adventurer can join the party.",
  "Performance Sprinter":
    "Keeps experiences fast, light, and responsive.",
  "Documentation Bard":
    "Tells the story so others can follow the path easily.",
  "Design Crafter":
    "Shapes delightful experiences with thoughtful visuals and user flows."
};

export function getTopDomains(levels: DomainLevelMap): DomainKey[] {
  return Object.entries(levels)
    .sort((a, b) => b[1] - a[1])
    .filter((entry) => entry[1] > 0)
    .slice(0, 2)
    .map((entry) => entry[0] as DomainKey);
}

export function getClassName(levels: DomainLevelMap): string {
  const topDomains = getTopDomains(levels);
  if (topDomains.length === 0) {
    return "Novice Wanderer";
  }

  const [first, second] = topDomains;
  if (first && second) {
    const frontBack =
      (first === "frontend" && second === "backend") ||
      (first === "backend" && second === "frontend");
    if (frontBack) {
      return "Full-Stack Adventurer";
    }
  }

  return classTitles[first];
}

export function getClassFlavour(className: string, topDomains: DomainKey[]): string {
  if (classFlavour[className]) {
    return classFlavour[className];
  }

  if (topDomains.length === 0) {
    return "Just beginning the quest, ready to learn new skills.";
  }

  const labels = topDomains.map((domain) => domainFragments[domain].label);
  return `Specialises in ${labels.join(" and ")}, with a friendly, practical focus.`;
}
