export type ClassValue =
  | string
  | number
  | null
  | false
  | undefined
  | Record<string, boolean>;

export function cn(...inputs: ClassValue[]) {
  return inputs
    .flatMap((input) => {
      if (!input) {
        return [];
      }
      if (typeof input === "string" || typeof input === "number") {
        return [String(input)];
      }
      if (typeof input === "object") {
        return Object.entries(input)
          .filter(([, value]) => value)
          .map(([key]) => key);
      }
      return [];
    })
    .join(" ");
}
