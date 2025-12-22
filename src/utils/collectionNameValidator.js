/**
 * Utility functions for validating and sanitizing Weaviate collection names
 */

// Regex for valid collection names: must start with uppercase letter,
// followed by letters, numbers, or underscores
const COLLECTION_NAME_REGEX = /^[A-Z][_0-9A-Za-z]*$/

/**
 * Validates if a collection name follows Weaviate's naming rules
 * @param {string} name - The collection name to validate
 * @returns {Object} Validation result with { valid: boolean, error: string, warning: string }
 */
export function validateCollectionName(name) {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return {
      valid: false,
      error: 'Collection name cannot be empty',
      warning: null
    }
  }

  const trimmedName = name.trim()

  // Check regex pattern
  if (!COLLECTION_NAME_REGEX.test(trimmedName)) {
    // Provide more specific error messages
    if (!/^[A-Z]/.test(trimmedName)) {
      return {
        valid: false,
        error: 'Collection name must start with an uppercase letter (A-Z)',
        warning: null
      }
    }
    
    return {
      valid: false,
      error: 'Collection name must start with an uppercase letter, followed by letters, numbers, or underscores',
      warning: null
    }
  }

  return {
    valid: true,
    error: null,
    warning: null
  }
}

/**
 * Sanitizes a collection name by fixing format and removing invalid characters
 * @param {string} name - The collection name to sanitize
 * @returns {string} Sanitized collection name
 */
export function sanitizeCollectionName(name) {
  if (!name || typeof name !== 'string') {
    return ''
  }

  let sanitized = name.trim()

  // First, replace invalid separator characters (-, ., etc) with spaces so they can be used as word boundaries
  sanitized = sanitized.replace(/[^_A-Za-z0-9\s]/g, ' ')

  // Convert spaces to CamelCase: split by spaces, capitalize each word, then join
  sanitized = sanitized.split(/\s+/).map((word, index) => {
    if (!word) return ''
    // Capitalize first letter of each word, preserve the rest
    return word.charAt(0).toUpperCase() + word.slice(1)
  }).join('')

  // Ensure first character is uppercase letter
  if (sanitized.length > 0) {
    // If starts with lowercase letter, make it uppercase
    if (/^[a-z]/.test(sanitized)) {
      sanitized = sanitized.charAt(0).toUpperCase() + sanitized.slice(1)
    }
    // If starts with number or underscore, prefix with a default uppercase letter
    else if (/^[0-9_]/.test(sanitized)) {
      sanitized = 'C' + sanitized
    }
  }

  return sanitized
}

/**
 * Auto-corrects a collection name by sanitizing it and returns validation result
 * @param {string} name - The collection name to auto-correct
 * @returns {Object} Result with { corrected: string, wasChanged: boolean, validation: Object }
 */
export function autoCorrectCollectionName(name) {
  const original = name || ''
  const corrected = sanitizeCollectionName(original)
  const validation = validateCollectionName(corrected)

  return {
    corrected,
    wasChanged: original !== corrected,
    validation
  }
}
