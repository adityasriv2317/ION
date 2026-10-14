const SEARCH_ENGINE = "https://www.google.com/search?q=";

export function resolveNavigationTarget(input: string): string {
  const value = input.trim();

  if (!value) return "ion://home";
  // if (/^https?:\\/\\//i.test(value)) return value
  if (/^https?:\/\//i.test(value)) return value;

  const looksLikeHost =
    !/\\s/.test(value) &&
    (value === "localhost" ||
      value.includes(".") ||
      /^\\d{1,3}(\\.\\d{1,3}){3}(:\\d+)?$/.test(value));

  if (looksLikeHost) return `https://${value}`;

  return `${SEARCH_ENGINE}${encodeURIComponent(value)}`;
}
