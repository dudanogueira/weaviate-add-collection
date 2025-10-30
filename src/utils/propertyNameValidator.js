/**
 * Utility functions for validating and sanitizing Weaviate property names
 */

// Reserved words that cannot be used as property names
const RESERVED_WORDS = ['_additional', 'id', '_id']

// Strongly discouraged property names
const DISCOURAGED_WORDS = ['vector', '_vector']

// Regex for valid property names: must start with letter or underscore,
// followed by letters, numbers, or underscores
const PROPERTY_NAME_REGEX = /^[_A-Za-z][_0-9A-Za-z]*$/

/**
 * Validates if a property name follows Weaviate's naming rules
 * @param {string} name - The property name to validate
 * @returns {Object} Validation result with { valid: boolean, error: string, warning: string }
 */
export function validatePropertyName(name) {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return {
      valid: false,
      error: 'Property name cannot be empty',
      warning: null
    }
  }

  const trimmedName = name.trim()

  // Check for reserved words
  if (RESERVED_WORDS.includes(trimmedName)) {
    return {
      valid: false,
      error: `"${trimmedName}" is a reserved word and cannot be used as a property name`,
      warning: null
    }
  }

  // Check for discouraged words
  if (DISCOURAGED_WORDS.includes(trimmedName)) {
    return {
      valid: true,
      error: null,
      warning: `"${trimmedName}" is strongly discouraged as it may cause future conflicts`
    }
  }

  // Check regex pattern
  if (!PROPERTY_NAME_REGEX.test(trimmedName)) {
    return {
      valid: false,
      error: 'Property name must start with a letter or underscore, followed by letters, numbers, or underscores',
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
 * Sanitizes a property name by removing invalid characters and fixing format
 * @param {string} name - The property name to sanitize
 * @returns {string} Sanitized property name
 */
export function sanitizePropertyName(name) {
  if (!name || typeof name !== 'string') {
    return ''
  }

  let sanitized = name.trim()

  // Replace spaces with underscores
  sanitized = sanitized.replace(/\s+/g, '_')

  // Remove invalid characters (keep only letters, numbers, underscores)
  sanitized = sanitized.replace(/[^_A-Za-z0-9]/g, '')

  // If starts with a number, prefix with underscore
  if (sanitized.length > 0 && /^[0-9]/.test(sanitized)) {
    sanitized = '_' + sanitized
  }

  // Check if result is a reserved word and append suffix if needed
  if (RESERVED_WORDS.includes(sanitized)) {
    sanitized = sanitized + '_prop'
  }

  return sanitized
}

/**
 * Auto-corrects a property name by sanitizing it and returns validation result
 * @param {string} name - The property name to auto-correct
 * @returns {Object} Result with { corrected: string, wasChanged: boolean, validation: Object }
 */
export function autoCorrectPropertyName(name) {
  const original = name || ''
  const corrected = sanitizePropertyName(original)
  const validation = validatePropertyName(corrected)

  return {
    corrected,
    wasChanged: original !== corrected,
    validation
  }
}
