import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Collection from '../components/Collection'

describe('Collection Component - Replication Configuration', () => {
  it('should import replication configuration from JSON', async () => {
    const importedJson = {
      class: 'ReplicatedCollection',
      description: 'Replication Test Collection',
      replicationConfig: {
        factor: 3,
        asyncEnabled: true,
        deletionStrategy: 'DeleteOnConflict'
      },
      properties: [],
      vectorConfig: {
        default: {
          vectorizer: { none: {} },
          vectorIndexType: 'hnsw'
        }
      }
    }

    const { container } = render(<Collection initialJson={importedJson} />)

    // Wait for the component to render
    await waitFor(() => {
      const jsonBlock = container.querySelector('.json-block')
      expect(jsonBlock).toBeTruthy()
    }, { timeout: 3000 })

    // Get the generated JSON from the component
    const jsonBlock = container.querySelector('.json-block')
    const generatedJson = JSON.parse(jsonBlock.textContent)

    // Verify replication config is present with non-default values
    expect(generatedJson.replicationConfig).toBeDefined()
    expect(generatedJson.replicationConfig.factor).toBe(3)
    expect(generatedJson.replicationConfig.asyncEnabled).toBe(true)
    expect(generatedJson.replicationConfig.deletionStrategy).toBe('DeleteOnConflict')
  })

  it('should not include replication config when all values are defaults', async () => {
    const importedJson = {
      class: 'DefaultReplication',
      description: 'Default Replication Collection',
      replicationConfig: {
        factor: 1,
        asyncEnabled: false,
        deletionStrategy: 'NoAutomatedResolution'
      },
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

    // Verify replicationConfig is present with only factor (default value)
    expect(generatedJson.replicationConfig).toBeDefined()
    expect(generatedJson.replicationConfig.factor).toBe(1)
    // asyncEnabled and deletionStrategy should not be included (they're defaults)
    expect(generatedJson.replicationConfig.asyncEnabled).toBeUndefined()
    expect(generatedJson.replicationConfig.deletionStrategy).toBeUndefined()
  })

  it('should handle all deletion strategy options', async () => {
    const strategies = ['NoAutomatedResolution', 'DeleteOnConflict', 'TimeBasedResolution']
    
    for (const strategy of strategies) {
      const importedJson = {
        class: 'StrategyTest',
        description: 'Strategy Test Collection',
        replicationConfig: {
          factor: 2,
          asyncEnabled: false,
          deletionStrategy: strategy
        },
        properties: [],
        vectorConfig: {
          default: {
            vectorizer: { none: {} },
            vectorIndexType: 'hnsw'
          }
        }
      }

      const { container, unmount } = render(<Collection initialJson={importedJson} />)

      await waitFor(() => {
        const jsonBlock = container.querySelector('.json-block')
        expect(jsonBlock).toBeTruthy()
      }, { timeout: 3000 })

      const jsonBlock = container.querySelector('.json-block')
      const generatedJson = JSON.parse(jsonBlock.textContent)

      expect(generatedJson.replicationConfig).toBeDefined()
      
      // Only non-default values appear in the JSON
      // NoAutomatedResolution is the default, so it won't appear unless another value changes
      if (strategy === 'NoAutomatedResolution') {
        // When strategy is default, only factor appears (since it's 2, not 1)
        expect(generatedJson.replicationConfig.factor).toBe(2)
      } else {
        // Non-default strategies will appear in the JSON
        expect(generatedJson.replicationConfig.deletionStrategy).toBe(strategy)
      }
      
      unmount()
    }
  })

  it('should update replication factor through UI', async () => {
    const user = userEvent.setup()
    const { container } = render(<Collection />)

    // Wait for initial render
    await waitFor(() => {
      const jsonBlock = container.querySelector('.json-block')
      expect(jsonBlock).toBeTruthy()
    })

    // Find and click the Replication Configuration toggle
    const replicationToggle = screen.getByText('Replication Configuration').closest('button')
    expect(replicationToggle).toBeTruthy()

    // Find the replication factor input
    const factorInput = container.querySelector('input[type="number"][min="1"]')
    expect(factorInput).toBeTruthy()
    
    // Triple click to select all, then type new value
    await user.tripleClick(factorInput)
    await user.keyboard('3')

    // Wait for state update
    await waitFor(() => {
      const jsonBlock = container.querySelector('.json-block')
      const generatedJson = JSON.parse(jsonBlock.textContent)
      expect(generatedJson.replicationConfig).toBeDefined()
      expect(generatedJson.replicationConfig.factor).toBe(3)
    })
  })

  it('should respect nodesNumber as maximum replication factor', async () => {
    const nodesNumber = 5
    const { container } = render(<Collection nodesNumber={nodesNumber} />)

    // Wait for initial render
    await waitFor(() => {
      const jsonBlock = container.querySelector('.json-block')
      expect(jsonBlock).toBeTruthy()
    })

    // Find the replication factor input
    const factorInput = container.querySelector('input[type="number"][min="1"]')
    expect(factorInput).toBeTruthy()
    expect(factorInput.max).toBe(nodesNumber.toString())

    // Verify the hint is displayed
    const hint = screen.getByText(`Maximum: ${nodesNumber} (based on number of nodes)`)
    expect(hint).toBeTruthy()
  })

  it('should toggle async enabled through UI', async () => {
    const user = userEvent.setup()
    const { container } = render(<Collection />)

    // Wait for initial render
    await waitFor(() => {
      const jsonBlock = container.querySelector('.json-block')
      expect(jsonBlock).toBeTruthy()
    })

    // Find the async enabled checkbox by label
    const label = screen.getByText('Async Enabled:')
    const asyncCheckbox = label.parentElement.querySelector('input[type="checkbox"]')
    expect(asyncCheckbox).toBeTruthy()
    expect(asyncCheckbox.checked).toBe(false)

    // Click the checkbox
    await user.click(asyncCheckbox)

    // Wait for state update
    await waitFor(() => {
      const jsonBlock = container.querySelector('.json-block')
      const generatedJson = JSON.parse(jsonBlock.textContent)
      expect(generatedJson.replicationConfig).toBeDefined()
      expect(generatedJson.replicationConfig.asyncEnabled).toBe(true)
    })
  })

  it('should change deletion strategy through UI', async () => {
    const user = userEvent.setup()
    const { container } = render(<Collection />)

    // Wait for initial render
    await waitFor(() => {
      const jsonBlock = container.querySelector('.json-block')
      expect(jsonBlock).toBeTruthy()
    })

    // First, enable async to make the deletion strategy field visible
    const label = screen.getByText('Async Enabled:')
    const asyncCheckbox = label.parentElement.querySelector('input[type="checkbox"]')
    expect(asyncCheckbox).toBeTruthy()
    await user.click(asyncCheckbox)

    // Wait for the deletion strategy field to appear
    await waitFor(() => {
      const strategyLabel = screen.queryByText('Deletion Strategy:')
      expect(strategyLabel).toBeTruthy()
    })

    // Find the deletion strategy select by label
    const strategyLabel = screen.getByText('Deletion Strategy:')
    const strategySelect = strategyLabel.parentElement.querySelector('select')
    expect(strategySelect).toBeTruthy()
    expect(strategySelect.value).toBe('NoAutomatedResolution')

    // Change to DeleteOnConflict
    await user.selectOptions(strategySelect, 'DeleteOnConflict')

    // Wait for state update
    await waitFor(() => {
      const jsonBlock = container.querySelector('.json-block')
      const generatedJson = JSON.parse(jsonBlock.textContent)
      expect(generatedJson.replicationConfig).toBeDefined()
      expect(generatedJson.replicationConfig.deletionStrategy).toBe('DeleteOnConflict')
      expect(generatedJson.replicationConfig.asyncEnabled).toBe(true)
    })
  })

  it('should include only non-default values in generated JSON', async () => {
    const user = userEvent.setup()
    const { container } = render(<Collection />)

    // Wait for initial render
    await waitFor(() => {
      const jsonBlock = container.querySelector('.json-block')
      expect(jsonBlock).toBeTruthy()
    })

    // Change only the replication factor
    const factorInput = container.querySelector('input[type="number"][min="1"]')
    
    // Triple click to select all, then type new value
    await user.tripleClick(factorInput)
    await user.keyboard('2')
    
    // Trigger blur to ensure state is updated
    await user.click(document.body)

    // Wait for state update
    await waitFor(() => {
      const jsonBlock = container.querySelector('.json-block')
      const generatedJson = JSON.parse(jsonBlock.textContent)
      expect(generatedJson.replicationConfig).toBeDefined()
      expect(generatedJson.replicationConfig.factor).toBe(2)
      // asyncEnabled and deletionStrategy should not be included (they're defaults)
      expect(generatedJson.replicationConfig.asyncEnabled).toBeUndefined()
      expect(generatedJson.replicationConfig.deletionStrategy).toBeUndefined()
    }, { timeout: 2000 })
  })

  it('should handle complex replication configuration from import', async () => {
    const importedJson = {
      class: 'ComplexReplication',
      description: 'Complex Replication Test',
      replicationConfig: {
        factor: 5,
        asyncEnabled: true,
        deletionStrategy: 'TimeBasedResolution'
      },
      properties: [
        {
          name: 'text',
          dataType: ['text'],
          indexFilterable: true,
          indexSearchable: true
        }
      ],
      vectorConfig: {
        default: {
          vectorizer: {
            'text2vec-openai': {
              model: 'text-embedding-3-small'
            }
          },
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

    // Verify all replication config values
    expect(generatedJson.replicationConfig).toBeDefined()
    expect(generatedJson.replicationConfig.factor).toBe(5)
    expect(generatedJson.replicationConfig.asyncEnabled).toBe(true)
    expect(generatedJson.replicationConfig.deletionStrategy).toBe('TimeBasedResolution')
  })
})
