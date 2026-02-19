import React, { createContext, useContext } from 'react'
import { parseVersion, isVersionAtLeast } from '../utils/versionUtils'
import { VERSION_FEATURES } from '../constants/versionFeatures'

/**
 * Context value: { weaviateVersion: string|null }
 * null / '' means "no restriction — show everything".
 */
const VersionContext = createContext({ weaviateVersion: null })

/**
 * Place at the root of <Collection> — all children can read the version.
 */
export function VersionProvider({ weaviateVersion, children }) {
  return (
    <VersionContext.Provider value={{ weaviateVersion: weaviateVersion || null }}>
      {children}
    </VersionContext.Provider>
  )
}

/**
 * Hook: resolves whether a registered feature is available given the current
 * weaviateVersion in context.
 *
 * Returns { available: boolean, minVersion: string|null, tooltip: string }
 *
 * When weaviateVersion is null/empty, available is always true.
 *
 * @param {string} featureId - key from VERSION_FEATURES
 */
export function useVersionFeature(featureId) {
  const { weaviateVersion } = useContext(VersionContext)
  const minVersion = VERSION_FEATURES[featureId]

  if (!minVersion || !weaviateVersion) {
    return { available: true, minVersion: minVersion || null, tooltip: '' }
  }

  const actual = parseVersion(weaviateVersion)
  const required = parseVersion(minVersion)
  const available = isVersionAtLeast(actual, required)

  return {
    available,
    minVersion,
    tooltip: available ? '' : `Requires Weaviate \u2265 ${minVersion}`,
  }
}

/**
 * Hook: returns all options, marking unavailable entries (whose `featureId`
 * requires a higher version than weaviateVersion) with `disabled: true` and
 * a `helpText` field explaining the requirement.
 *
 * Options without a `featureId` are always available.
 * When weaviateVersion is null/empty, the array is returned unchanged.
 *
 * @param {Array<{ featureId?: string, [key: string]: any }>} options
 * @returns {Array}
 */
export function useVersionFilteredOptions(options) {
  const { weaviateVersion } = useContext(VersionContext)

  if (!weaviateVersion) return options

  const actual = parseVersion(weaviateVersion)

  return options.map(opt => {
    if (!opt.featureId) return opt
    const minVersion = VERSION_FEATURES[opt.featureId]
    if (!minVersion) return opt
    if (isVersionAtLeast(actual, parseVersion(minVersion))) return opt
    return {
      ...opt,
      disabled: true,
      helpText: `Requires Weaviate \u2265 ${minVersion}`,
    }
  })
}

/**
 * VersionGated — wraps any field or section.
 *
 * When the feature is NOT available:
 *   - Content renders greyed out (opacity 0.4, pointer-events none)
 *   - A CSS tooltip shows "Requires Weaviate ≥ X.Y.Z" on hover
 *     (tooltip styles live in styles.css via [data-version-tooltip])
 *   - An invisible overlay captures clicks so controls inside cannot be used
 *
 * When the feature IS available (or version is unconstrained):
 *   - Returns children in a plain fragment — zero wrapper DOM overhead
 *
 * Props:
 *   featureId {string} - key from VERSION_FEATURES
 *   children  {node}
 */
export function VersionGated({ featureId, children }) {
  const { available, tooltip } = useVersionFeature(featureId)

  if (available) {
    return <>{children}</>
  }

  return (
    <div data-version-tooltip={tooltip} style={{ position: 'relative' }}>
      {/* Click-capture overlay — prevents interaction with greyed children */}
      <div
        style={{ position: 'absolute', inset: 0, zIndex: 1, cursor: 'not-allowed' }}
        aria-hidden="true"
      />
      {/* Greyed content */}
      <div style={{ opacity: 0.4, pointerEvents: 'none', userSelect: 'none' }}>
        {children}
      </div>
    </div>
  )
}
