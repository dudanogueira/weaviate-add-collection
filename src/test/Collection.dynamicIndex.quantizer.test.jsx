import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Collection from '../components/Collection'

describe('Collection - Dynamic Index with Quantizers', () => {
  it('should hide Compression/Quantization tab when dynamic index is selected', async () => {
    const user = userEvent.setup()
    render(<Collection />)
    
    // Expand Vectorizer Configuration section
    const vectorizerToggle = screen.getByText('Vectorizer Configuration').closest('button')
    await user.click(vectorizerToggle)
    
    // Wait for section to expand
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /add vector config/i })).toBeInTheDocument()
    })
    
    // Add a vector config
    const addVectorBtn = screen.getByRole('button', { name: /add vector config/i })
    await user.click(addVectorBtn)
    
    // Switch to Index Configuration tab
  const indexTab = screen.getByRole('button', { name: 'Index Configuration' })
    await user.click(indexTab)
    
    // Select dynamic index type
  const indexTypeSelect1 = screen.getByLabelText('Index Type')
  await user.selectOptions(indexTypeSelect1, 'dynamic')
    
    // Compression/Quantization tab should not be visible
    await waitFor(() => {
      const compressionTab = screen.queryByRole('button', { name: /compression\/quantization/i })
      expect(compressionTab).toBeNull()
    })
  })
  
  it('should show Compression/Quantization tab for non-dynamic index types', async () => {
    const user = userEvent.setup()
    render(<Collection />)
    
    // Expand Vectorizer Configuration section
    const vectorizerToggle = screen.getByText('Vectorizer Configuration').closest('button')
    await user.click(vectorizerToggle)
    
    // Wait for section to expand
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /add vector config/i })).toBeInTheDocument()
    })
    
    // Add a vector config
    const addVectorBtn = screen.getByRole('button', { name: /add vector config/i })
    await user.click(addVectorBtn)
    
    // Compression/Quantization tab should be visible for HNSW (default)
    const compressionTab = screen.getByRole('button', { name: /compression\/quantization/i })
    expect(compressionTab).toBeInTheDocument()
  })
  
  it('should export dynamic index with HNSW PQ quantizer correctly', async () => {
    const user = userEvent.setup()
    const { container } = render(<Collection />)
    
    // Set collection name
  const nameInput = screen.getByPlaceholderText('MyCollection')
    await user.clear(nameInput)
    await user.type(nameInput, 'TestCollection')
    
    // Expand Vectorizer Configuration section
    const vectorizerToggle = screen.getByText('Vectorizer Configuration').closest('button')
    await user.click(vectorizerToggle)
    
    // Wait for section to expand
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /add vector config/i })).toBeInTheDocument()
    })
    
    // Add a vector config
    const addVectorBtn = screen.getByRole('button', { name: /add vector config/i })
    await user.click(addVectorBtn)
    
    // Switch to Index Configuration tab
  const indexTab = screen.getByRole('button', { name: 'Index Configuration' })
    await user.click(indexTab)
    
    // Select dynamic index type
  const indexTypeSelect2 = screen.getByLabelText('Index Type')
  await user.selectOptions(indexTypeSelect2, 'dynamic')
    
    // Navigate to HNSW Config sub-tab
    await waitFor(() => {
      const hnswTab = screen.getByRole('button', { name: /hnsw config/i })
      expect(hnswTab).toBeInTheDocument()
    })
    const hnswTab = screen.getByRole('button', { name: /hnsw config/i })
    await user.click(hnswTab)
    
    // Find and select PQ quantization (within HNSW panel)
    await waitFor(() => {
      expect(screen.getByText(/HNSW Parameters/i)).toBeInTheDocument()
    })
    const hnswQuantizationSelect = screen.getByLabelText('Quantization Type')
    await user.selectOptions(hnswQuantizationSelect, 'pq')
    
    // Wait for PQ settings to appear
    await waitFor(() => {
      expect(screen.getByText(/pq settings/i)).toBeInTheDocument()
    })
    
    // Get the generated JSON
    const jsonOutput = container.querySelector('pre')
    expect(jsonOutput).toBeTruthy()
    
    const generatedJson = JSON.parse(jsonOutput.textContent)
    
    // Verify the structure
    expect(generatedJson.vectorConfig).toBeDefined()
    expect(generatedJson.vectorConfig.default).toBeDefined()
    expect(generatedJson.vectorConfig.default.vectorIndexType).toBe('dynamic')
    expect(generatedJson.vectorConfig.default.vectorIndexConfig).toBeDefined()
    expect(generatedJson.vectorConfig.default.vectorIndexConfig.hnsw).toBeDefined()
    // Note: The 'pq' object should be in the hnsw config
    expect(generatedJson.vectorConfig.default.vectorIndexConfig.hnsw.pq).toBeDefined()
  })
  
  it('should export dynamic index with Flat BQ quantizer correctly', async () => {
    const user = userEvent.setup()
    const { container } = render(<Collection />)
    
    // Set collection name
  const nameInput = screen.getByPlaceholderText('MyCollection')
    await user.clear(nameInput)
    await user.type(nameInput, 'TestCollection')
    
    // Expand Vectorizer Configuration section
    const vectorizerToggle = screen.getByText('Vectorizer Configuration').closest('button')
    await user.click(vectorizerToggle)
    
    // Wait for section to expand
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /add vector config/i })).toBeInTheDocument()
    })
    
    // Add a vector config
    const addVectorBtn = screen.getByRole('button', { name: /add vector config/i })
    await user.click(addVectorBtn)
    
    // Switch to Index Configuration tab
  const indexTab = screen.getByRole('button', { name: 'Index Configuration' })
    await user.click(indexTab)
    
    // Select dynamic index type
  const indexTypeSelect3 = screen.getByLabelText('Index Type')
  await user.selectOptions(indexTypeSelect3, 'dynamic')
    
    // Navigate to Flat Config sub-tab
    await waitFor(() => {
      const flatTab = screen.getByRole('button', { name: /flat config/i })
      expect(flatTab).toBeInTheDocument()
    })
    const flatTab = screen.getByRole('button', { name: /flat config/i })
    await user.click(flatTab)
    
    // Find and select BQ quantization for flat (within Flat panel)
    await waitFor(() => {
      expect(screen.getByText(/Flat Parameters/i)).toBeInTheDocument()
    })
    const flatQuantizationSelectForSelect = screen.getByLabelText('Quantization Type')
    await user.selectOptions(flatQuantizationSelectForSelect, 'bq')
    
    // Wait for BQ settings to appear
    await waitFor(() => {
      expect(screen.getByText(/bq settings/i)).toBeInTheDocument()
    })
    
    // Get the generated JSON
    const jsonOutput = container.querySelector('pre')
    expect(jsonOutput).toBeTruthy()
    
    const generatedJson = JSON.parse(jsonOutput.textContent)
    
    // Verify the structure
    expect(generatedJson.vectorConfig).toBeDefined()
    expect(generatedJson.vectorConfig.default).toBeDefined()
    expect(generatedJson.vectorConfig.default.vectorIndexType).toBe('dynamic')
    expect(generatedJson.vectorConfig.default.vectorIndexConfig).toBeDefined()
    expect(generatedJson.vectorConfig.default.vectorIndexConfig.flat).toBeDefined()
    // Note: The 'bq' object should be in the flat config
    expect(generatedJson.vectorConfig.default.vectorIndexConfig.flat.bq).toBeDefined()
  })
  
  it('should only show BQ option for flat index quantization', async () => {
    const user = userEvent.setup()
    render(<Collection />)
    
    // Expand Vectorizer Configuration section
    const vectorizerToggle = screen.getByText('Vectorizer Configuration').closest('button')
    await user.click(vectorizerToggle)
    
    // Wait for section to expand
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /add vector config/i })).toBeInTheDocument()
    })
    
    // Add a vector config
    const addVectorBtn = screen.getByRole('button', { name: /add vector config/i })
    await user.click(addVectorBtn)
    
    // Switch to Index Configuration tab
  const indexTab = screen.getByRole('button', { name: 'Index Configuration' })
    await user.click(indexTab)
    
    // Select dynamic index type
  const indexTypeSelect3b = screen.getByLabelText('Index Type')
  await user.selectOptions(indexTypeSelect3b, 'dynamic')
    
    // Navigate to Flat Config sub-tab
    await waitFor(() => {
      const flatTab = screen.getByRole('button', { name: /flat config/i })
      expect(flatTab).toBeInTheDocument()
    })
    const flatTab = screen.getByRole('button', { name: /flat config/i })
    await user.click(flatTab)
    
    // Find flat quantization select and assert options (within Flat panel)
    await waitFor(() => {
      expect(screen.getByText(/Flat Parameters/i)).toBeInTheDocument()
    })
    {
      const flatQuantizationSelect = screen.getByLabelText('Quantization Type')
      const options = Array.from(flatQuantizationSelect.options).map(opt => opt.value)
      expect(options).toContain('none')
      expect(options).toContain('bq')
      expect(options).not.toContain('pq')
      expect(options).not.toContain('sq')
    }
  })
  
  it('should import dynamic index with quantizers correctly', async () => {
    const initialJson = {
      class: 'TestCollection',
      description: 'Test',
      vectorConfig: {
        default: {
          vectorizer: {
            'text2vec-openai': {
              model: 'text-embedding-3-small',
              vectorizeClassName: true
            }
          },
          vectorIndexType: 'dynamic',
          vectorIndexConfig: {
            threshold: 10000,
            hnsw: {
              ef: -1,
              efConstruction: 128,
              maxConnections: 32,
              pq: {
                segments: 256,
                centroids: 256,
                enabled: true
              }
            },
            flat: {
              bq: {
                cache: false,
                rescoreLimit: -1,
                enabled: true
              }
            }
          }
        }
      }
    }
    
    const user = userEvent.setup()
    const { container } = render(<Collection initialJson={initialJson} />)
    
    // Expand Vectorizer Configuration section
    const vectorizerToggle = screen.getByText('Vectorizer Configuration').closest('button')
    await user.click(vectorizerToggle)
    
    // Open vector configs section
    await waitFor(() => {
      const vectorConfigSection = screen.getByText(/vector config #1/i)
      expect(vectorConfigSection).toBeInTheDocument()
    })
    
    // Switch to Index Configuration tab
  const indexTab = screen.getByRole('button', { name: 'Index Configuration' })
    await user.click(indexTab)
    
    // Verify dynamic index is selected
  const indexTypeSelect4 = screen.getByLabelText('Index Type')
  expect(indexTypeSelect4.value).toBe('dynamic')
    
    // Navigate to HNSW Config sub-tab
    const hnswTab = screen.getByRole('button', { name: /hnsw config/i })
    await user.click(hnswTab)
    
    // Verify PQ is selected (within HNSW panel)
    await waitFor(() => {
      const hnswSelect = screen.getByLabelText('Quantization Type')
      expect(hnswSelect.value).toBe('pq')
    })
    
    // Navigate to Flat Config sub-tab
    const flatTab = screen.getByRole('button', { name: /flat config/i })
    await user.click(flatTab)
    
    // Verify BQ is selected (within Flat panel)
    await waitFor(() => {
      const flatSelect = screen.getByLabelText('Quantization Type')
      expect(flatSelect.value).toBe('bq')
    })
    
    // Verify the exported JSON matches the imported structure
    const jsonOutput = container.querySelector('pre')
    const generatedJson = JSON.parse(jsonOutput.textContent)
    
    expect(generatedJson.vectorConfig.default.vectorIndexConfig.hnsw.pq).toBeDefined()
    expect(generatedJson.vectorConfig.default.vectorIndexConfig.flat.bq).toBeDefined()
  })
})
