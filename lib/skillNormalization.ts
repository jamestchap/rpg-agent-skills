export function normalizeSkillMarkdown(raw: string): string {
  if (!raw) {
    return raw;
  }

  let text = raw.replace(/^\uFEFF/, "").trimStart();
  let strippedFence = false;
  const fenceMatch = text.match(/^```[a-zA-Z0-9-]*\s*\n/);
  if (fenceMatch) {
    text = text.slice(fenceMatch[0].length);
    strippedFence = true;
  }

  if (strippedFence) {
    text = text.replace(/\n?```[\s]*$/, "");
  }

  const lines = text.split("\n");
  const firstFrontmatterIndex = lines.findIndex(
    (line) => line.trim() === "---"
  );
  if (firstFrontmatterIndex > 0) {
    text = lines.slice(firstFrontmatterIndex).join("\n").trimStart();
  }

  return text;
}
