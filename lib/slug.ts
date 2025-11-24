const ACCENT_REGEX = /[\u0300-\u036f]/g
const NON_ALNUM_REGEX = /[^a-z0-9]+/g

export function slugify(rawValue: string): string {
  if (!rawValue) {
    return ""
  }

  return rawValue
    .normalize("NFKD")
    .replace(ACCENT_REGEX, "")
    .toLowerCase()
    .replace(NON_ALNUM_REGEX, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
}

export function looksLikeFirestoreId(value: string): boolean {
  return /^[A-Za-z0-9]{20}$/.test(value)
}

export function buildSlugCandidate(name?: string, fallback?: string): string {
  const slugFromName = slugify(name ?? "")
  if (slugFromName) return slugFromName

  const slugFromFallback = slugify(fallback ?? "")
  if (slugFromFallback) return slugFromFallback

  return "hotel"
}

