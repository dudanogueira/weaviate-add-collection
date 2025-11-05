import { describe, it, expect } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Collection from '../components/Collection'

describe('Collection Component - Field Preservation After Edit', () => {
  it('should preserve all imported fields when changing collection name', async () => {
    const user = userEvent.setup()
    
    const importedJson = {
      class: 'OriginalName',
      description: 'Original description',
      multiTenancyConfig: {
        enabled: true,
        autoTenantCreation: true,
        autoTenantActivation: false
      },
      properties: [
        {
          name: 'testProperty',
          dataType: ['text'],
          indexFilterable: true,
          indexSearchable: true,
          tokenization: 'word'
        }
      ],
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

    // Verify initial state
    let jsonBlock = container.querySelector('.json-block')
    let generatedJson = JSON.parse(jsonBlock.textContent)
    
    expect(generatedJson.class).toBe('OriginalName')
    expect(generatedJson.properties).toHaveLength(1)
    expect(generatedJson.multiTenancyConfig).toBeDefined()
    expect(generatedJson.vectorConfig).toBeDefined()

    // Change the collection name
    const nameInput = container.querySelector('#collection-name')
    await user.clear(nameInput)
    await user.type(nameInput, 'NewName')

    // Wait for update
    await waitFor(() => {
      const jsonBlock = container.querySelector('.json-block')
      const generatedJson = JSON.parse(jsonBlock.textContent)
      expect(generatedJson.class).toBe('NewName')
    }, { timeout: 3000 })

    // Verify all other fields are still present
    jsonBlock = container.querySelector('.json-block')
    generatedJson = JSON.parse(jsonBlock.textContent)

    expect(generatedJson.class).toBe('NewName')
    expect(generatedJson.description).toBe('Original description')
    expect(generatedJson.properties).toHaveLength(1)
    expect(generatedJson.properties[0].name).toBe('testProperty')
    expect(generatedJson.multiTenancyConfig).toBeDefined()
    expect(generatedJson.multiTenancyConfig.enabled).toBe(true)
    expect(generatedJson.multiTenancyConfig.autoTenantCreation).toBe(true)
    expect(generatedJson.multiTenancyConfig.autoTenantActivation).toBe(false)
    expect(generatedJson.vectorConfig).toBeDefined()
  })

  it('should preserve all imported fields when changing description', async () => {
    const user = userEvent.setup()
    
    const importedJson = {
      class: 'TestCollection',
      description: 'Original description',
      multiTenancyConfig: {
        enabled: true,
        autoTenantCreation: false,
        autoTenantActivation: true
      },
      properties: [
        {
          name: 'field1',
          dataType: ['text']
        },
        {
          name: 'field2',
          dataType: ['number']
        }
      ],
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

    // Change the description
    const descInput = container.querySelector('#collection-description')
    await user.clear(descInput)
    await user.type(descInput, 'Updated description')

    // Wait for update
    await waitFor(() => {
      const jsonBlock = container.querySelector('.json-block')
      const generatedJson = JSON.parse(jsonBlock.textContent)
      expect(generatedJson.description).toBe('Updated description')
    }, { timeout: 3000 })

    // Verify all other fields are still present
    const jsonBlock = container.querySelector('.json-block')
    const generatedJson = JSON.parse(jsonBlock.textContent)

    expect(generatedJson.class).toBe('TestCollection')
    expect(generatedJson.description).toBe('Updated description')
    expect(generatedJson.properties).toHaveLength(2)
    expect(generatedJson.properties[0].name).toBe('field1')
    expect(generatedJson.properties[1].name).toBe('field2')
    expect(generatedJson.multiTenancyConfig).toBeDefined()
    expect(generatedJson.multiTenancyConfig.enabled).toBe(true)
    expect(generatedJson.multiTenancyConfig.autoTenantCreation).toBe(false)
    expect(generatedJson.multiTenancyConfig.autoTenantActivation).toBe(true)
    expect(generatedJson.vectorConfig).toBeDefined()
  })

  it('should preserve all fields when clearing name to empty string', async () => {
    const user = userEvent.setup()
    
    const importedJson = {
      class: 'TestCollection',
      description: 'Test description',
      properties: [
        {
          name: 'testProp',
          dataType: ['text']
        }
      ]
    }

    const { container } = render(<Collection initialJson={importedJson} />)

    await waitFor(() => {
      const jsonBlock = container.querySelector('.json-block')
      expect(jsonBlock).toBeTruthy()
    }, { timeout: 3000 })

    // Clear the name
    const nameInput = container.querySelector('#collection-name')
    await user.clear(nameInput)

    // Wait for update
    await waitFor(() => {
      const jsonBlock = container.querySelector('.json-block')
      const generatedJson = JSON.parse(jsonBlock.textContent)
      expect(generatedJson.class).toBe('')
    }, { timeout: 3000 })

    // Verify properties are still present
    const jsonBlock = container.querySelector('.json-block')
    const generatedJson = JSON.parse(jsonBlock.textContent)

    expect(generatedJson.class).toBe('')
    expect(generatedJson.description).toBe('Test description')
    expect(generatedJson.properties).toHaveLength(1)
    expect(generatedJson.properties[0].name).toBe('testProp')
  })
})
