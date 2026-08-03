/**
 * Shared defaults for the inverted index config.
 *
 * These are the *server's* defaults, not merely initial form values: the
 * serialization effect in Collection.jsx diffs against this object and only
 * emits the keys that differ, so that a collection the user never touched
 * produces no `invertedIndexConfig` key at all. Changing a value here changes
 * what gets omitted from the generated schema.
 *
 * Note the UI uses snake_case keys and the wire format uses camelCase; the
 * mapping lives in the Collection.jsx effect, not here.
 */
export const DEFAULT_INVERTED_INDEX_CONFIG = {
  bm25_b: 0.75,
  bm25_k1: 1.2,
  cleanup_interval_seconds: 60,
  index_timestamps: false,
  index_property_length: false,
  index_null_state: false,
  stopwords_preset: 'en',
  stopwords_additions: [],
  stopwords_removals: [],
  // User-defined stopword presets (Weaviate >= 1.37.2), held as an ordered list
  // of { name, words } rows rather than the wire format's { [name]: words }
  // object. An object cannot represent a half-typed row -- there is no valid
  // empty key, and renaming a preset would lose its position and its words.
  // Serialization converts to the object shape and drops invalid rows.
  stopwords_presets: [],
}

/**
 * Fresh copy for use as component state.
 *
 * DEFAULT_INVERTED_INDEX_CONFIG holds arrays, so a plain spread would alias
 * them across every consumer. Use this anywhere the result is stored in state;
 * use the constant directly only for read-only diffing.
 */
export const createDefaultInvertedIndexConfig = () => ({
  ...DEFAULT_INVERTED_INDEX_CONFIG,
  stopwords_additions: [],
  stopwords_removals: [],
  stopwords_presets: [],
})
