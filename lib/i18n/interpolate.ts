// Replaces {name} placeholders. Safe on server and client.
export function interpolate(
  template: string,
  vars?: Record<string, string | number>,
): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    key in vars ? String(vars[key]) : `{${key}}`,
  );
}

// Resolves a dotted path ("training.format.online") against a dictionary.
export function resolvePath(obj: unknown, path: string): string {
  const value = path
    .split(".")
    .reduce<unknown>((acc, k) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[k] : undefined), obj);
  return typeof value === "string" ? value : path;
}
