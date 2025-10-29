import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import Collection from '../components/Collection'

describe('Collection Component - Array Type Import Test', () => {
  it('should mark array checkbox when importing properties with array types', async () => {
    // Create a JSON with array types
    const jsonWithArrays = {
      class: 'TestArrayCollection',
      name: 'TestArrayCollection',
      description: 'Testing array type import',
      properties: [
        {
          name: 'tags',
          dataType: ['text[]'],
          description: 'Array of tags',
          indexFilterable: true,
          indexSearchable: true,
          tokenization: 'word'
        },
        {
          name: 'scores',
          dataType: ['number[]'],
          description: 'Array of scores',
          indexFilterable: true,
          indexRangeFilters: true
        },
        {
          name: 'title',
          dataType: ['text'],
          description: 'Single text field',
          indexFilterable: true,
          indexSearchable: true,
          tokenization: 'word'
        }
      ]
    }

    // Render the component with imported JSON
    const { container } = render(<Collection initialJson={jsonWithArrays} />)

    // Wait for the component to render
    await waitFor(() => {
      const jsonBlock = container.querySelector('.json-block')
      expect(jsonBlock).toBeTruthy()
    })

    // Get the generated JSON
    const jsonBlock = container.querySelector('.json-block')
    const generatedJson = JSON.parse(jsonBlock.textContent)

    // Verify the collection name is loaded
    expect(generatedJson.class).toBe('TestArrayCollection')

    // Verify properties are correctly imported
    expect(generatedJson.properties).toHaveLength(3)

    // Check that array types are preserved
    const tagsProperty = generatedJson.properties.find(p => p.name === 'tags')
    expect(tagsProperty).toBeDefined()
    expect(tagsProperty.dataType).toEqual(['text[]'])

    const scoresProperty = generatedJson.properties.find(p => p.name === 'scores')
    expect(scoresProperty).toBeDefined()
    expect(scoresProperty.dataType).toEqual(['number[]'])

    // Check that non-array types don't have []
    const titleProperty = generatedJson.properties.find(p => p.name === 'title')
    expect(titleProperty).toBeDefined()
    expect(titleProperty.dataType).toEqual(['text'])
  })

  it('should handle mixed array notation formats', async () => {
    // Test with different ways array types might be represented
    const jsonVariations = {
      class: 'MixedArrayTest',
      description: 'Testing various array formats',
      properties: [
        {
          name: 'items1',
          dataType: ['int[]'],  // Standard array notation
          description: 'Integer array',
          indexFilterable: true
        },
        {
          name: 'items2',
          dataType: 'boolean[]',  // String instead of array
          description: 'Boolean array',
          indexFilterable: true
        }
      ]
    }

    const { container } = render(<Collection initialJson={jsonVariations} />)

    await waitFor(() => {
      const jsonBlock = container.querySelector('.json-block')
      expect(jsonBlock).toBeTruthy()
    })

    const jsonBlock = container.querySelector('.json-block')
    const generatedJson = JSON.parse(jsonBlock.textContent)

    // Both should be recognized as arrays
    const items1 = generatedJson.properties.find(p => p.name === 'items1')
    expect(items1.dataType[0]).toContain('[]')

    const items2 = generatedJson.properties.find(p => p.name === 'items2')
    expect(items2.dataType[0]).toContain('[]')
  })
})
