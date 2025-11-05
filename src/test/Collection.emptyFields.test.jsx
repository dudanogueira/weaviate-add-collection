import { describe, it, expect } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import Collection from '../components/Collection'

describe('Collection Component - Empty Fields Preservation', () => {
  it('should preserve empty name and description from imported JSON', async () => {
    const importedJson = {
      class: '',
      description: '',
      properties: [],
      vectorConfig: {
        default: {
          vectorizer: { none: {} },
          vectorIndexType: 'hnsw'
        }
      }
    }

    const { container } = render(<Collection initialJson={importedJson} />)

    await waitFor(() => {
      const jsonBlock = container.querySelector('.json-block')
      expect(jsonBlock).toBeTruthy()
    }, { timeout: 3000 })

    const jsonBlock = container.querySelector('.json-block')
    const generatedJson = JSON.parse(jsonBlock.textContent)

    // Verify that empty strings are preserved, not replaced with defaults
    expect(generatedJson.class).toBe('')
    expect(generatedJson.description).toBe('')
  })

  it('should preserve specific name and description values from imported JSON', async () => {
    const importedJson = {
      class: 'TestCollection',
      description: 'Test description',
      properties: [],
      vectorConfig: {
        default: {
          vectorizer: { none: {} },
          vectorIndexType: 'hnsw'
        }
      }
    }

    const { container } = render(<Collection initialJson={importedJson} />)

    await waitFor(() => {
      const jsonBlock = container.querySelector('.json-block')
      expect(jsonBlock).toBeTruthy()
    }, { timeout: 3000 })

    const jsonBlock = container.querySelector('.json-block')
    const generatedJson = JSON.parse(jsonBlock.textContent)

    // Verify that values are preserved exactly as imported
    expect(generatedJson.class).toBe('TestCollection')
    expect(generatedJson.description).toBe('Test description')
  })

  it('should use defaults when no initialJson is provided', async () => {
    const { container } = render(<Collection />)

    await waitFor(() => {
      const jsonBlock = container.querySelector('.json-block')
      expect(jsonBlock).toBeTruthy()
    }, { timeout: 3000 })

    const jsonBlock = container.querySelector('.json-block')
    const generatedJson = JSON.parse(jsonBlock.textContent)

    // Verify that defaults are used when creating a new collection
    expect(generatedJson.class).toBe('MyCollection')
    expect(generatedJson.description).toBe('A Brand new collection')
  })

  it('should preserve whitespace-only values', async () => {
    const importedJson = {
      class: '   ',
      description: '  ',
      properties: []
    }

    const { container } = render(<Collection initialJson={importedJson} />)

    await waitFor(() => {
      const jsonBlock = container.querySelector('.json-block')
      expect(jsonBlock).toBeTruthy()
    }, { timeout: 3000 })

    const jsonBlock = container.querySelector('.json-block')
    const generatedJson = JSON.parse(jsonBlock.textContent)

    // Verify that whitespace is preserved
    expect(generatedJson.class).toBe('   ')
    expect(generatedJson.description).toBe('  ')
  })
})
