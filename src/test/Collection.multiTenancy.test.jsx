import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Collection from '../components/Collection'

describe('Collection Component - Multi-Tenancy Configuration', () => {
  it('should import multi-tenancy configuration from JSON', async () => {
    const importedJson = {
      class: 'MT',
      description: 'Multi-Tenancy Test Collection',
      multiTenancyConfig: {
        enabled: true,
        autoTenantCreation: true,
        autoTenantActivation: true
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

    // Verify multi-tenancy config is present
    expect(generatedJson.multiTenancyConfig).toBeDefined()
    expect(generatedJson.multiTenancyConfig.enabled).toBe(true)
    expect(generatedJson.multiTenancyConfig.autoTenantCreation).toBe(true)
    expect(generatedJson.multiTenancyConfig.autoTenantActivation).toBe(true)
  })

  it('should not include multi-tenancy config when disabled', async () => {
    const importedJson = {
      class: 'NoMT',
      description: 'Non-Multi-Tenancy Collection',
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

    // Verify multi-tenancy config is not present
    expect(generatedJson.multiTenancyConfig).toBeUndefined()
  })

  it('should toggle multi-tenancy enabled through UI', async () => {
    const user = userEvent.setup()
    const { container } = render(<Collection />)

    // Wait for initial render
    await waitFor(() => {
      const jsonBlock = container.querySelector('.json-block')
      expect(jsonBlock).toBeTruthy()
    })

    // Find the Multi Tenancy Configuration toggle button
    const multiTenancyToggle = screen.getByText('Multi Tenancy Configuration').closest('button')
    
    // Check if it's expanded or collapsed initially
    const isExpanded = multiTenancyToggle.getAttribute('aria-expanded') === 'true'
    
    // If it's collapsed, click to expand it
    if (!isExpanded) {
      await user.click(multiTenancyToggle)
      
      // Wait for section to expand
      await waitFor(() => {
        expect(multiTenancyToggle.getAttribute('aria-expanded')).toBe('true')
      })
    }

    // Wait for the section content to be visible
    await waitFor(() => {
      expect(screen.getByText(/^Enabled:$/)).toBeInTheDocument()
    })

    // Find and click the Enabled checkbox
    const enabledLabel = screen.getByText(/^Enabled:$/)
    const enabledCheckbox = enabledLabel.parentElement.querySelector('input[type="checkbox"]')
    await user.click(enabledCheckbox)

    // Wait for the component to update
    await waitFor(() => {
      const jsonBlock = container.querySelector('.json-block')
      const generatedJson = JSON.parse(jsonBlock.textContent)
      expect(generatedJson.multiTenancyConfig).toBeDefined()
      expect(generatedJson.multiTenancyConfig.enabled).toBe(true)
    }, { timeout: 3000 })
  })

  it('should include only enabled sub-options in JSON', async () => {
    const importedJson = {
      class: 'PartialMT',
      description: 'Partial Multi-Tenancy Collection',
      multiTenancyConfig: {
        enabled: true,
        autoTenantCreation: true,
        // autoTenantActivation is false/not set
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

    // Verify multi-tenancy config structure
    expect(generatedJson.multiTenancyConfig).toBeDefined()
    expect(generatedJson.multiTenancyConfig.enabled).toBe(true)
    expect(generatedJson.multiTenancyConfig.autoTenantCreation).toBe(true)
    // autoTenantActivation should not be in the JSON if it's false
    expect(generatedJson.multiTenancyConfig.autoTenantActivation).toBeUndefined()
  })

  it('should disable sub-options when multi-tenancy is disabled', async () => {
    const user = userEvent.setup()
    const { container } = render(<Collection />)

    // Wait for initial render
    await waitFor(() => {
      const jsonBlock = container.querySelector('.json-block')
      expect(jsonBlock).toBeTruthy()
    })

    // Find the Multi Tenancy Configuration toggle button
    const multiTenancyToggle = screen.getByText('Multi Tenancy Configuration').closest('button')
    
    // Check if it's expanded or collapsed initially
    const isExpanded = multiTenancyToggle.getAttribute('aria-expanded') === 'true'
    
    // If it's collapsed, click to expand it
    if (!isExpanded) {
      await user.click(multiTenancyToggle)
      
      // Wait for section to expand
      await waitFor(() => {
        expect(multiTenancyToggle.getAttribute('aria-expanded')).toBe('true')
      })
    }

    // Wait for section to expand and content to be visible
    await waitFor(() => {
      expect(screen.getByText(/^Auto Tenant Creation:$/)).toBeInTheDocument()
    })

    // Check that sub-options are disabled when main option is disabled
    const autoCreationLabel = screen.getByText(/^Auto Tenant Creation:$/)
    const autoCreationCheckbox = autoCreationLabel.parentElement.querySelector('input[type="checkbox"]')
    expect(autoCreationCheckbox.disabled).toBe(true)

    const autoActivationLabel = screen.getByText(/^Auto Tenant Activation:$/)
    const autoActivationCheckbox = autoActivationLabel.parentElement.querySelector('input[type="checkbox"]')
    expect(autoActivationCheckbox.disabled).toBe(true)
  })
})
