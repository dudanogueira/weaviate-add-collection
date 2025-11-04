import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import Collection from '../components/Collection'

describe('Collection Import - Vectorize Property Name', () => {
  it('should read vectorizePropertyName from imported property moduleConfig', async () => {
    const initialJson = {
      class: 'ImportVectorizeName',
      description: 'Test import of property vectorization flag',
      properties: [
        {
          name: 'description',
          dataType: ['text'],
          description: 'A text field',
          indexFilterable: true,
          indexSearchable: true,
          tokenization: 'word',
          moduleConfig: {
            'text2vec-openai': {
              vectorizePropertyName: true
            }
          }
        }
      ],
      vectorConfig: {
        default: {
          vectorizer: {
            'text2vec-openai': {}
          },
          vectorIndexType: 'hnsw'
        }
      }
    }

    const { container } = render(<Collection initialJson={initialJson} />)

    await waitFor(() => {
      const jsonBlock = container.querySelector('.json-block')
      expect(jsonBlock).toBeTruthy()
    })

    const jsonBlock = container.querySelector('.json-block')
    const generated = JSON.parse(jsonBlock.textContent)

    const prop = generated.properties.find(p => p.name === 'description')
    expect(prop).toBeDefined()
    // Ensure moduleConfig is generated with vectorizePropertyName
    expect(prop.moduleConfig).toBeDefined()
    expect(prop.moduleConfig['text2vec-openai']).toBeDefined()
    expect(prop.moduleConfig['text2vec-openai'].vectorizePropertyName).toBe(true)
  })
})
