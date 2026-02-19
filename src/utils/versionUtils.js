/**
 * Lightweight semver utilities — no external library.
 * Supports "MAJOR.MINOR.PATCH" strings only.
 */

/**
 * Parse a version string like "1.25.3" into an integer triple.
 * Returns [0, 0, 0] for empty / null / malformed input.
 *
 * @param {string|null|undefined} versionStr
 * @returns {[number, number, number]}
 */
export function parseVersion(versionStr) {
  if (!versionStr || typeof versionStr !== 'string') return [0, 0, 0]
  const [major, minor, patch] = versionStr.trim().split('.').map(p => parseInt(p, 10) || 0)
  return [major || 0, minor || 0, patch || 0]
}

/**
 * Returns true when `actual` >= `required`.
 * Both arguments are [major, minor, patch] triples from parseVersion().
 *
 * @param {[number, number, number]} actual
 * @param {[number, number, number]} required
 * @returns {boolean}
 */
export function isVersionAtLeast(actual, required) {
  for (let i = 0; i < 3; i++) {
    if (actual[i] > required[i]) return true
    if (actual[i] < required[i]) return false
  }
  return true // equal
}
