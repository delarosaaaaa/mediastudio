export const fmtN = (n?: number | null): string =>
  n != null ? n.toLocaleString("en-US") : "—";

export const fmtE = (n?: number | null): string =>
  n != null ? `€${Number(n).toFixed(2)}` : "—";

export const fmtP = (n?: number | null): string =>
  n != null ? `${Number(n).toFixed(1)}%` : "—";

export const fmtK = (n?: number | null): string => {
  if (n == null || n === 0) return "—";
  if (n >= 1_000_000) return `€${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `€${(n / 1_000).toFixed(0)}K`;
  return `€${n}`;
};
