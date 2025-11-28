import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Collection from '../components/Collection'

describe('Collection - Quantization Import Tests', () => {
  it('should import HNSW with PQ quantization and render it correctly in the form', async () => {
    const initialJson = {
      class: 'TestPQCollection',
      vectorConfig: {
        default: {
          vectorizer: { 'text2vec-openai': {} },
          vectorIndexType: 'hnsw',
          vectorIndexConfig: {
            pq: {
              segments: 256,
              centroids: 256,
              enabled: true
            }
          }
        }
      }
    }

    const user = userEvent.setup()
    render(<Collection initialJson={initialJson} />)

    // Expand vector config section
    const vectorConfigBtn = screen.getByRole('button', { name: /vectorizer configuration/i })
    await user.click(vectorConfigBtn)

    // Wait for Vector Config #1 to appear
    await waitFor(() => {
      expect(screen.getByText(/vector config #1/i)).toBeInTheDocument()
    })

    // Click on Compression/Quantization tab
    const compressionTab = screen.getByRole('button', { name: /compression\/quantization/i })
    await user.click(compressionTab)

    // Verify PQ is selected
    await waitFor(() => {
      const quantizationSelect = screen.getByLabelText(/quantization type/i)
      expect(quantizationSelect.value).toBe('pq')
    })
  })

  it('should import HNSW with RQ quantization and render it correctly in the form', async () => {
    const initialJson = {
      class: 'TestRQCollection',
      vectorConfig: {
        default: {
          vectorizer: { 'text2vec-openai': {} },
          vectorIndexType: 'hnsw',
          vectorIndexConfig: {
            rq: {
              bits: 8,
              rescoreLimit: 20,
              enabled: true
            }
          }
        }
      }
    }

    const user = userEvent.setup()
    render(<Collection initialJson={initialJson} />)

    // Expand vector config section
    const vectorConfigBtn = screen.getByRole('button', { name: /vectorizer configuration/i })
    await user.click(vectorConfigBtn)

    // Wait for Vector Config #1 to appear
    await waitFor(() => {
      expect(screen.getByText(/vector config #1/i)).toBeInTheDocument()
    })

    // Click on Compression/Quantization tab
    const compressionTab = screen.getByRole('button', { name: /compression\/quantization/i })
    await user.click(compressionTab)

    // Verify RQ is selected
    await waitFor(() => {
      const quantizationSelect = screen.getByLabelText(/quantization type/i)
      expect(quantizationSelect.value).toBe('rq')
    })
  })

  it('should import Flat with BQ quantization and render it correctly in the form', async () => {
    const initialJson = {
      class: 'TestFlatBQCollection',
      vectorConfig: {
        default: {
          vectorizer: { 'text2vec-openai': {} },
          vectorIndexType: 'flat',
          vectorIndexConfig: {
            bq: {
              rescoreLimit: -1,
              cache: false,
              enabled: true
            }
          }
        }
      }
    }

    const user = userEvent.setup()
    const { container } = render(<Collection initialJson={initialJson} />)

    // Expand vector config section
    const vectorConfigBtn = screen.getByRole('button', { name: /vectorizer configuration/i })
    await user.click(vectorConfigBtn)

    // Wait for Vector Config #1 to appear
    await waitFor(() => {
      expect(screen.getByText(/vector config #1/i)).toBeInTheDocument()
    })

    // Click on Index Configuration tab (the tab within VectorConfigItem, not the collapsible)
    const indexTabs = screen.getAllByRole('button', { name: 'Index Configuration' })
    // First one is the tab inside VectorConfigItem
    await user.click(indexTabs[0])

    // Verify flat index is selected
    await waitFor(() => {
      const indexTypeSelect = screen.getByLabelText(/index type/i)
      expect(indexTypeSelect.value).toBe('flat')
    })

    // Verify BQ is selected for flat
    await waitFor(() => {
      const quantizationSelect = screen.getByLabelText(/quantization type/i)
      expect(quantizationSelect.value).toBe('bq')
    })

    // Verify JSON export includes BQ
    const jsonOutput = container.querySelector('pre')
    const generatedJson = JSON.parse(jsonOutput.textContent)
    expect(generatedJson.vectorConfig.default.vectorIndexConfig.bq).toBeDefined()
  })

  it('should import Flat with RQ quantization and render it correctly in the form', async () => {
    const initialJson = {
      class: 'TestFlatRQCollection',
      vectorConfig: {
        default: {
          vectorizer: { 'text2vec-openai': {} },
          vectorIndexType: 'flat',
          vectorIndexConfig: {
            rq: {
              bits: 8,
              rescoreLimit: 20,
              enabled: true
            }
          }
        }
      }
    }

    const user = userEvent.setup()
    const { container } = render(<Collection initialJson={initialJson} />)

    // Expand vector config section
    const vectorConfigBtn = screen.getByRole('button', { name: /vectorizer configuration/i })
    await user.click(vectorConfigBtn)

    // Wait for Vector Config #1 to appear
    await waitFor(() => {
      expect(screen.getByText(/vector config #1/i)).toBeInTheDocument()
    })

    // Click on Index Configuration tab (the tab within VectorConfigItem, not the collapsible)
    const indexTabs = screen.getAllByRole('button', { name: 'Index Configuration' })
    // First one is the tab inside VectorConfigItem
    await user.click(indexTabs[0])

    // Verify flat index is selected
    await waitFor(() => {
      const indexTypeSelect = screen.getByLabelText(/index type/i)
      expect(indexTypeSelect.value).toBe('flat')
    })

    // Verify RQ is selected for flat
    await waitFor(() => {
      const quantizationSelect = screen.getByLabelText(/quantization type/i)
      expect(quantizationSelect.value).toBe('rq')
    })

    // Verify JSON export includes RQ
    const jsonOutput = container.querySelector('pre')
    const generatedJson = JSON.parse(jsonOutput.textContent)
    expect(generatedJson.vectorConfig.default.vectorIndexConfig.rq).toBeDefined()
    expect(generatedJson.vectorConfig.default.vectorIndexConfig.rq.bits).toBe(8)
  })

  it('should import dynamic index with HNSW BQ quantization and render it correctly', async () => {
    const initialJson = {
      class: 'TestDynamicBQCollection',
      vectorConfig: {
        default: {
          vectorizer: { 'text2vec-openai': {} },
          vectorIndexType: 'dynamic',
          vectorIndexConfig: {
            threshold: 10000,
            hnsw: {
              bq: {
                rescoreLimit: -1,
                cache: false,
                enabled: true
              }
            },
            flat: {}
          }
        }
      }
    }

    const user = userEvent.setup()
    const { container } = render(<Collection initialJson={initialJson} />)

    // Expand vector config section
    const vectorConfigBtn = screen.getByRole('button', { name: /vectorizer configuration/i })
    await user.click(vectorConfigBtn)

    // Wait for Vector Config #1 to appear
    await waitFor(() => {
      expect(screen.getByText(/vector config #1/i)).toBeInTheDocument()
    })

    // Click on Index Configuration tab (the tab within VectorConfigItem, not the collapsible)
    const indexTabs = screen.getAllByRole('button', { name: 'Index Configuration' })
    // First one is the tab inside VectorConfigItem
    await user.click(indexTabs[0])

    // Verify dynamic index is selected
    await waitFor(() => {
      const indexTypeSelect = screen.getByLabelText(/index type/i)
      expect(indexTypeSelect.value).toBe('dynamic')
    })

    // Click on HNSW Config tab
    const hnswTab = screen.getByRole('button', { name: /hnsw config/i })
    await user.click(hnswTab)

    // Verify BQ is selected for HNSW
    await waitFor(() => {
      const quantizationSelect = screen.getByLabelText(/quantization type/i)
      expect(quantizationSelect.value).toBe('bq')
    })

    // Verify JSON export includes BQ under hnsw
    const jsonOutput = container.querySelector('pre')
    const generatedJson = JSON.parse(jsonOutput.textContent)
    expect(generatedJson.vectorConfig.default.vectorIndexConfig.hnsw.bq).toBeDefined()
  })
})
