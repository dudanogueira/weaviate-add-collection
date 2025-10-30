import { describe, it, expect } from 'vitest'
import { 
  validatePropertyName, 
  sanitizePropertyName, 
  autoCorrectPropertyName 
} from '../utils/propertyNameValidator'

describe('Property Name Validator', () => {
  describe('validatePropertyName', () => {
    it('should accept valid property names', () => {
      const validNames = [
        'myProperty',
        'my_property',
        '_privateProperty',
        'Property123',
        'property_123',
        '_123property',
        'UPPERCASE',
        'camelCase',
        'snake_case'
      ]

      validNames.forEach(name => {
        const result = validatePropertyName(name)
        expect(result.valid).toBe(true)
        expect(result.error).toBeNull()
      })
    })

    it('should reject reserved words', () => {
      const reservedWords = ['_additional', 'id', '_id']

      reservedWords.forEach(name => {
        const result = validatePropertyName(name)
        expect(result.valid).toBe(false)
        expect(result.error).toContain('reserved word')
      })
    })

    it('should warn about discouraged words', () => {
      const discouragedWords = ['vector', '_vector']

      discouragedWords.forEach(name => {
        const result = validatePropertyName(name)
        expect(result.valid).toBe(true)
        expect(result.warning).toContain('discouraged')
      })
    })

    it('should reject names starting with numbers', () => {
      const result = validatePropertyName('123property')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('must start with a letter or underscore')
    })

    it('should reject names with invalid characters', () => {
      const invalidNames = [
        'my-property',
        'my.property',
        'my property',
        'my@property',
        'my#property',
        'property!',
        'property$'
      ]

      invalidNames.forEach(name => {
        const result = validatePropertyName(name)
        expect(result.valid).toBe(false)
        expect(result.error).toContain('must start with a letter or underscore')
      })
    })

    it('should reject empty names', () => {
      const result = validatePropertyName('')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('cannot be empty')
    })

    it('should reject null/undefined names', () => {
      expect(validatePropertyName(null).valid).toBe(false)
      expect(validatePropertyName(undefined).valid).toBe(false)
    })
  })

  describe('sanitizePropertyName', () => {
    it('should remove invalid characters', () => {
      expect(sanitizePropertyName('my-property')).toBe('myproperty')
      expect(sanitizePropertyName('my.property')).toBe('myproperty')
      expect(sanitizePropertyName('my@property')).toBe('myproperty')
      expect(sanitizePropertyName('my#property')).toBe('myproperty')
    })

    it('should replace spaces with underscores', () => {
      expect(sanitizePropertyName('my property')).toBe('my_property')
      expect(sanitizePropertyName('my  multiple   spaces')).toBe('my_multiple_spaces')
    })

    it('should prefix numbers with underscore', () => {
      expect(sanitizePropertyName('123property')).toBe('_123property')
      expect(sanitizePropertyName('456')).toBe('_456')
    })

    it('should handle reserved words by adding suffix', () => {
      expect(sanitizePropertyName('_additional')).toBe('_additional_prop')
      expect(sanitizePropertyName('id')).toBe('id_prop')
      expect(sanitizePropertyName('_id')).toBe('_id_prop')
    })

    it('should trim whitespace', () => {
      expect(sanitizePropertyName('  myProperty  ')).toBe('myProperty')
    })

    it('should handle empty/null input', () => {
      expect(sanitizePropertyName('')).toBe('')
      expect(sanitizePropertyName(null)).toBe('')
      expect(sanitizePropertyName(undefined)).toBe('')
    })

    it('should keep valid names unchanged', () => {
      expect(sanitizePropertyName('myProperty')).toBe('myProperty')
      expect(sanitizePropertyName('_privateProperty')).toBe('_privateProperty')
      expect(sanitizePropertyName('property_123')).toBe('property_123')
    })
  })

  describe('autoCorrectPropertyName', () => {
    it('should correct invalid names and mark as changed', () => {
      const result = autoCorrectPropertyName('my-property')
      expect(result.corrected).toBe('myproperty')
      expect(result.wasChanged).toBe(true)
      expect(result.validation.valid).toBe(true)
    })

    it('should not change valid names', () => {
      const result = autoCorrectPropertyName('myProperty')
      expect(result.corrected).toBe('myProperty')
      expect(result.wasChanged).toBe(false)
      expect(result.validation.valid).toBe(true)
    })

    it('should provide validation results', () => {
      const result = autoCorrectPropertyName('123invalid')
      expect(result.validation.valid).toBe(true)
      expect(result.corrected).toBe('_123invalid')
    })
  })

  describe('Edge cases and complex scenarios', () => {
    it('should handle complex invalid names', () => {
      const testCases = [
        { input: '123-my@property name!', expected: '_123myproperty_name' },
        { input: 'Property Name (v2)', expected: 'Property_Name_v2' },
        { input: 'first-name', expected: 'firstname' },
        { input: 'user.email.address', expected: 'useremailaddress' }
      ]

      testCases.forEach(({ input, expected }) => {
        expect(sanitizePropertyName(input)).toBe(expected)
      })
    })

    it('should validate sanitized names correctly', () => {
      const invalidNames = [
        'my-property',
        'my.property',
        '123property',
        'user name'
      ]

      invalidNames.forEach(name => {
        const sanitized = sanitizePropertyName(name)
        const validation = validatePropertyName(sanitized)
        expect(validation.valid).toBe(true)
      })
    })
  })
})
