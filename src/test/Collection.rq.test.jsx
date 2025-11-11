import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Collection from '../components/Collection'

describe('Collection RQ (Rotational Quantization) Handling', () => {
  beforeEach(() => {
    // Clear any previous renders
  })

  it('should correctly import a collection with RQ configuration', async () => {
    const jsonWithRQ = {
      class: 'TestCollection',
      description: 'Test with RQ',
      vectorConfig: {
        default: {
          vectorizer: {
            'text2vec-openai': {}
          },
          vectorIndexType: 'hnsw',
          vectorIndexConfig: {
            rq: {
              bits: 8,
              rescoreLimit: 20,
              enabled: true
            }
          }
        }
      },
      properties: []
    }

    render(<Collection initialJson={jsonWithRQ} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('TestCollection')).toBeInTheDocument()
    })

    // Check that the configuration was imported successfully
    // by verifying that generated JSON contains RQ
    const jsonBlock = screen.getByText(/"class"/, { selector: 'pre' })
    const generatedJsonText = jsonBlock.textContent
    const generatedJson = JSON.parse(generatedJsonText)

    expect(generatedJson.vectorConfig.default.vectorIndexConfig).toHaveProperty('rq')
    expect(generatedJson.vectorConfig.default.vectorIndexConfig.rq).toMatchObject({
      bits: 8,
      rescoreLimit: 20,
      enabled: true
    })
  })

  it('should support RQ in dynamic index type for HNSW config', async () => {
    const jsonWithDynamicRQ = {
      class: 'TestDynamicRQ',
      description: 'Test with dynamic index and RQ',
      vectorConfig: {
        default: {
          vectorizer: {
            'text2vec-openai': {}
          },
          vectorIndexType: 'dynamic',
          vectorIndexConfig: {
            threshold: 10000,
            hnsw: {
              rq: {
                bits: 8,
                rescoreLimit: 20,
                enabled: true
              }
            },
            flat: {}
          }
        }
      },
      properties: []
    }

    render(<Collection initialJson={jsonWithDynamicRQ} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('TestDynamicRQ')).toBeInTheDocument()
    })

    // Check that dynamic RQ config was imported correctly
    const jsonBlock = screen.getByText(/"class"/, { selector: 'pre' })
    const generatedJsonText = jsonBlock.textContent
    const generatedJson = JSON.parse(generatedJsonText)

    expect(generatedJson.vectorConfig.default.vectorIndexType).toBe('dynamic')
    expect(generatedJson.vectorConfig.default.vectorIndexConfig.hnsw).toHaveProperty('rq')
    expect(generatedJson.vectorConfig.default.vectorIndexConfig.hnsw.rq).toMatchObject({
      bits: 8,
      rescoreLimit: 20,
      enabled: true
    })
  })

  it('should support RQ with Flat index type', async () => {
    const jsonWithFlatRQ = {
      class: 'TestFlatRQ',
      description: 'Test with flat index and RQ',
      vectorConfig: {
        default: {
          vectorizer: {
            'text2vec-openai': {}
          },
          vectorIndexType: 'flat',
          vectorIndexConfig: {
            rq: {
              bits: 8,
              rescoreLimit: 20,
              enabled: true
            }
          }
        }
      },
      properties: []
    }

    render(<Collection initialJson={jsonWithFlatRQ} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('TestFlatRQ')).toBeInTheDocument()
    })

    // Check that flat RQ config was imported correctly
    const jsonBlock = screen.getByText(/"class"/, { selector: 'pre' })
    const generatedJsonText = jsonBlock.textContent
    const generatedJson = JSON.parse(generatedJsonText)

    expect(generatedJson.vectorConfig.default.vectorIndexType).toBe('flat')
    expect(generatedJson.vectorConfig.default.vectorIndexConfig).toHaveProperty('rq')
    expect(generatedJson.vectorConfig.default.vectorIndexConfig.rq).toMatchObject({
      bits: 8,
      rescoreLimit: 20,
      enabled: true
    })
  })

  it('should support RQ in dynamic index type for Flat config', async () => {
    const jsonWithDynamicFlatRQ = {
      class: 'TestDynamicFlatRQ',
      description: 'Test with dynamic index and RQ on flat',
      vectorConfig: {
        default: {
          vectorizer: {
            'text2vec-openai': {}
          },
          vectorIndexType: 'dynamic',
          vectorIndexConfig: {
            threshold: 10000,
            hnsw: {},
            flat: {
              rq: {
                bits: 8,
                rescoreLimit: 20,
                enabled: true
              }
            }
          }
        }
      },
      properties: []
    }

    render(<Collection initialJson={jsonWithDynamicFlatRQ} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('TestDynamicFlatRQ')).toBeInTheDocument()
    })

    // Check that dynamic flat RQ config was imported correctly
    const jsonBlock = screen.getByText(/"class"/, { selector: 'pre' })
    const generatedJsonText = jsonBlock.textContent
    const generatedJson = JSON.parse(generatedJsonText)

    expect(generatedJson.vectorConfig.default.vectorIndexType).toBe('dynamic')
    expect(generatedJson.vectorConfig.default.vectorIndexConfig.flat).toHaveProperty('rq')
    expect(generatedJson.vectorConfig.default.vectorIndexConfig.flat.rq).toMatchObject({
      bits: 8,
      rescoreLimit: 20,
      enabled: true
    })
  })

  it('should support RQ bits value of 1', async () => {
    const jsonWithRQ1Bit = {
      class: 'TestRQ1Bit',
      description: 'Test with RQ 1 bit',
      vectorConfig: {
        default: {
          vectorizer: {
            'text2vec-openai': {}
          },
          vectorIndexType: 'hnsw',
          vectorIndexConfig: {
            rq: {
              bits: 1,
              rescoreLimit: 20,
              enabled: true
            }
          }
        }
      },
      properties: []
    }

    render(<Collection initialJson={jsonWithRQ1Bit} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('TestRQ1Bit')).toBeInTheDocument()
    })

    // Check that RQ with 1 bit was imported correctly
    const jsonBlock = screen.getByText(/"class"/, { selector: 'pre' })
    const generatedJsonText = jsonBlock.textContent
    const generatedJson = JSON.parse(generatedJsonText)

    expect(generatedJson.vectorConfig.default.vectorIndexConfig).toHaveProperty('rq')
    expect(generatedJson.vectorConfig.default.vectorIndexConfig.rq.bits).toBe(1)
  })
})
