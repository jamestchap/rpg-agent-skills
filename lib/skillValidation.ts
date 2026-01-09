export interface ValidationResult {
  valid: boolean;
  message: string;
}

export function validateSkillMarkdown(markdown: string): ValidationResult {
  const trimmed = markdown.trim();
  if (!trimmed.startsWith("---")) {
    return {
      valid: false,
      message: "Missing YAML front matter."
    };
  }
  const lines = trimmed.split("\n");
  const endIndex = lines.slice(1).indexOf("---");
  if (endIndex === -1) {
    return {
      valid: false,
      message: "YAML front matter is not closed."
    };
  }
  const headerLines = lines.slice(1, endIndex + 1);
  const hasName = headerLines.some((line) => line.trim().startsWith("name:"));
  const hasDescription = headerLines.some((line) =>
    line.trim().startsWith("description:")
  );
  if (!hasName || !hasDescription) {
    return {
      valid: false,
      message: "YAML header must include name and description."
    };
  }
  return {
    valid: true,
    message: "Valid YAML header found."
  };
}
