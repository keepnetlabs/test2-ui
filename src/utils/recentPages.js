/**
 * Persists the most-recently-visited page names for the command palette's
 * "Recent" section. Storage is best-effort: any failure (private mode, quota,
 * corrupt value) degrades to an empty list rather than throwing.
 */

const STORAGE_KEY = "commandPalette.recentPages";
const MAX_RECENT = 5;

export function getRecentPageNames() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(name => typeof name === "string");
  } catch (e) {
    return [];
  }
}

/**
 * Records a page as most-recent (deduped, capped). Returns the new list.
 * @param {string} name  route name
 */
export function recordRecentPage(name) {
  if (!name || typeof name !== "string") {
    return getRecentPageNames();
  }
  const next = [name, ...getRecentPageNames().filter(n => n !== name)].slice(
    0,
    MAX_RECENT
  );
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (e) {
    // Storage unavailable — recents are a convenience, not critical state.
  }
  return next;
}
