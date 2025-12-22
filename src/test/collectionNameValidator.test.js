import { describe, it, expect } from 'vitest'
import { 
  validateCollectionName, 
  sanitizeCollectionName, 
  autoCorrectCollectionName 
} from '../utils/collectionNameValidator'

describe('Collection Name Validator', () => {
  describe('validateCollectionName', () => {
    it('should accept valid collection names', () => {
      const validNames = [
        'MyCollection',
        'Collection123',
        'My_Collection',
        'Collection_123',
        'UPPERCASE',
        'CamelCase',
        'Snake_Case',
        'A',
        'A1',
        'A_',
        'Article',
        'ProductCatalog',
        'User_Profile'
      ]

      validNames.forEach(name => {
        const result = validateCollectionName(name)
        expect(result.valid).toBe(true)
        expect(result.error).toBeNull()
      })
    })

    it('should reject names starting with lowercase letters', () => {
      const invalidNames = ['myCollection', 'collection', 'article']

      invalidNames.forEach(name => {
        const result = validateCollectionName(name)
        expect(result.valid).toBe(false)
        expect(result.error).toContain('uppercase letter')
      })
    })

    it('should reject names starting with numbers', () => {
      const invalidNames = ['1Collection', '123', '0MyClass']

      invalidNames.forEach(name => {
        const result = validateCollectionName(name)
        expect(result.valid).toBe(false)
        expect(result.error).toContain('uppercase letter')
      })
    })

    it('should reject names starting with underscores', () => {
      const invalidNames = ['_Collection', '_myClass', '__Private']

      invalidNames.forEach(name => {
        const result = validateCollectionName(name)
        expect(result.valid).toBe(false)
        expect(result.error).toContain('uppercase letter')
      })
    })

    it('should reject names with invalid characters', () => {
      const invalidNames = [
        'My-Collection',
        'My.Collection',
        'My Collection',
        'My@Collection',
        'Collection!',
        'My$Class'
      ]

      invalidNames.forEach(name => {
        const result = validateCollectionName(name)
        expect(result.valid).toBe(false)
        expect(result.error).toBeTruthy()
      })
    })

    it('should reject empty names', () => {
      const emptyNames = ['', '   ', null, undefined]

      emptyNames.forEach(name => {
        const result = validateCollectionName(name)
        expect(result.valid).toBe(false)
        expect(result.error).toContain('empty')
      })
    })

    it('should handle trimmed names correctly', () => {
      const result1 = validateCollectionName('  MyCollection  ')
      expect(result1.valid).toBe(true)

      const result2 = validateCollectionName('  myCollection  ')
      expect(result2.valid).toBe(false)
    })
  })

  describe('sanitizeCollectionName', () => {
    it('should capitalize first letter if lowercase', () => {
      expect(sanitizeCollectionName('myCollection')).toBe('MyCollection')
      expect(sanitizeCollectionName('article')).toBe('Article')
    })

    it('should prefix with "C" if starts with number', () => {
      expect(sanitizeCollectionName('123Collection')).toBe('C123Collection')
      expect(sanitizeCollectionName('1')).toBe('C1')
    })

    it('should prefix with "C" if starts with underscore', () => {
      expect(sanitizeCollectionName('_Collection')).toBe('C_Collection')
      expect(sanitizeCollectionName('__Private')).toBe('C__Private')
    })

    it('should convert spaces to CamelCase', () => {
      expect(sanitizeCollectionName('My Collection')).toBe('MyCollection')
      expect(sanitizeCollectionName('My  Big  Collection')).toBe('MyBigCollection')
      expect(sanitizeCollectionName('some test here')).toBe('SomeTestHere')
      expect(sanitizeCollectionName('test collection name')).toBe('TestCollectionName')
    })

    it('should remove invalid characters', () => {
      expect(sanitizeCollectionName('My-Collection')).toBe('MyCollection')
      expect(sanitizeCollectionName('My.Collection')).toBe('MyCollection')
      expect(sanitizeCollectionName('My@Collection!')).toBe('MyCollection')
      expect(sanitizeCollectionName('Product$Price')).toBe('ProductPrice')
    })

    it('should trim whitespace', () => {
      expect(sanitizeCollectionName('  MyCollection  ')).toBe('MyCollection')
    })

    it('should handle empty or invalid input', () => {
      expect(sanitizeCollectionName('')).toBe('')
      expect(sanitizeCollectionName(null)).toBe('')
      expect(sanitizeCollectionName(undefined)).toBe('')
    })

    it('should preserve valid names', () => {
      expect(sanitizeCollectionName('MyCollection')).toBe('MyCollection')
      expect(sanitizeCollectionName('Article_123')).toBe('Article_123')
    })
  })

  describe('autoCorrectCollectionName', () => {
    it('should correct and validate names', () => {
      const result = autoCorrectCollectionName('myCollection')
      expect(result.corrected).toBe('MyCollection')
      expect(result.wasChanged).toBe(true)
      expect(result.validation.valid).toBe(true)
    })

    it('should detect when name was not changed', () => {
      const result = autoCorrectCollectionName('MyCollection')
      expect(result.corrected).toBe('MyCollection')
      expect(result.wasChanged).toBe(false)
      expect(result.validation.valid).toBe(true)
    })

    it('should handle complex corrections', () => {
      const result = autoCorrectCollectionName('my-collection 123')
      expect(result.corrected).toBe('MyCollection123')
      expect(result.wasChanged).toBe(true)
      expect(result.validation.valid).toBe(true)
    })

    it('should handle names starting with numbers', () => {
      const result = autoCorrectCollectionName('123collection')
      expect(result.corrected).toBe('C123collection')
      expect(result.wasChanged).toBe(true)
      expect(result.validation.valid).toBe(true)
    })
  })
})
