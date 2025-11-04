import React, { useEffect, useState } from 'react'
import PropertySection from './PropertySection'
import VectorConfigSection from './VectorConfigSection'

// Contract:
// Inputs: optional `initialJson` object with { name, description }
//         optional `availableModules` object with available vectorizer modules
// Outputs: none for now; component displays generated JSON and allows editing fields.

export default function Collection({ initialJson = null, availableModules = null }) {
  const [name, setName] = useState(initialJson?.name || '')
  const [description, setDescription] = useState(initialJson?.description || '')
  const [generatedJson, setGeneratedJson] = useState({})
  const [openBasic, setOpenBasic] = useState(true)
  const [openProperties, setOpenProperties] = useState(true)
  const [openVectorConfig, setOpenVectorConfig] = useState(true)

  useEffect(() => {
    // Handle both 'name' and 'class' fields for backwards compatibility
    setName(initialJson?.name || initialJson?.class || '')
    setDescription(initialJson?.description || '')
    // Also load properties from imported JSON
    if (initialJson?.properties && Array.isArray(initialJson.properties)) {
      setProperties(initialJson.properties.map(p => {
        // Extract the base data type and check if it's an array
        // Handle both array format ['text[]'] and string format 'text[]'
        let dataTypeValue
        if (Array.isArray(p.dataType)) {
          dataTypeValue = p.dataType[0]
        } else if (typeof p.dataType === 'string') {
          dataTypeValue = p.dataType
        } else {
          dataTypeValue = 'text'
        }
        
        const isArrayType = dataTypeValue ? dataTypeValue.includes('[]') : false
        const baseDataType = dataTypeValue ? dataTypeValue.replace('[]', '') : 'text'

        // Derive per-property vectorization settings from imported moduleConfig (if any)
        let vectorizePropertyName
        if (baseDataType === 'text' && p.moduleConfig && typeof p.moduleConfig === 'object') {
          try {
            const anyTrue = Object.values(p.moduleConfig).some(cfg => cfg && typeof cfg === 'object' && cfg.vectorizePropertyName === true)
            if (anyTrue) vectorizePropertyName = true
          } catch (_) {
            // ignore malformed moduleConfig
          }
        }

        return {
          name: p.name || '',
          dataType: baseDataType,
          description: p.description || '',
          indexFilterable: p.indexFilterable ?? true,
          indexRangeFilters: p.indexRangeFilters ?? false,
          indexSearchable: p.indexSearchable ?? true,
          isArray: isArrayType,
          tokenization: p.tokenization || 'word',
          ...(vectorizePropertyName === true ? { vectorizePropertyName: true } : {})
        }
      }))
    }
    // Fill vectorConfigs from the imported JSON's vectorConfig
    if (initialJson?.vectorConfig && typeof initialJson.vectorConfig === 'object') {
      const configs = Object.entries(initialJson.vectorConfig).map(([name, config]) => {
        // Extract name, vectorizer, indexType, indexConfig
        const vectorizerKey = config.vectorizer ? Object.keys(config.vectorizer)[0] : ''
        const moduleConfig = vectorizerKey ? config.vectorizer[vectorizerKey] : {}
        
        // Handle indexConfig - need to process quantizers correctly
        let indexConfig = config.vectorIndexConfig || {}
        const indexType = config.vectorIndexType || 'hnsw'
        
        // For dynamic index type, extract quantizers from hnsw and flat sub-configs
        if (indexType === 'dynamic') {
          const processedIndexConfig = { ...indexConfig }
          
          // Process HNSW quantizer
          if (indexConfig.hnsw) {
            const hnswConfig = { ...indexConfig.hnsw }
            // Check for PQ, BQ, or SQ configuration and extract quantizer
            if (indexConfig.hnsw.pq) {
              hnswConfig.quantizer = 'pq'
              hnswConfig.pq = indexConfig.hnsw.pq
            } else if (indexConfig.hnsw.bq) {
              hnswConfig.quantizer = 'bq'
              hnswConfig.bq = indexConfig.hnsw.bq
            } else if (indexConfig.hnsw.sq) {
              hnswConfig.quantizer = 'sq'
              hnswConfig.sq = indexConfig.hnsw.sq
            } else {
              hnswConfig.quantizer = 'none'
            }
            processedIndexConfig.hnsw = hnswConfig
          }
          
          // Process Flat quantizer (only BQ supported)
          if (indexConfig.flat) {
            const flatConfig = { ...indexConfig.flat }
            if (indexConfig.flat.bq) {
              flatConfig.quantizer = 'bq'
              flatConfig.bq = indexConfig.flat.bq
            } else {
              flatConfig.quantizer = 'none'
            }
            processedIndexConfig.flat = flatConfig
          }
          
          indexConfig = processedIndexConfig
        } else {
          // For non-dynamic types (HNSW, Flat), quantizers are directly in indexConfig
          // They're already in the correct format (pq, bq, sq as direct properties)
          // No processing needed - just keep them as-is
        }
        
        return {
          name,
          vectorizer: vectorizerKey,
          moduleConfig,
          indexType,
          indexConfig,
          // Note: No longer using separate quantization field
          vectorizeClassName: moduleConfig?.vectorizeClassName || false
        }
      })
      setVectorConfigs(configs)
    }
  }, [initialJson])

  useEffect(() => {
    const j = {
      class: name || 'MyCollection',
      description: description || 'A Brand new collection'
    }
    setGeneratedJson(j)
  }, [name, description])

  // properties state managed here and merged into generated JSON
  const [properties, setProperties] = useState([])
  
  // vectorConfig state managed here and merged into generated JSON
  const [vectorConfigs, setVectorConfigs] = useState([])

  useEffect(() => {
    // Transform properties into final JSON shape:
    const transformed = (properties || []).map((p, idx) => {
      // Extract base type and ensure it doesn't contain []
      let rawBaseType = typeof p.dataType === 'string' ? p.dataType : (Array.isArray(p.dataType) ? p.dataType[0] : 'text')
      const baseType = rawBaseType ? rawBaseType.replace('[]', '') : 'text'
      const typeValue = p.isArray ? `${baseType}[]` : baseType
      // placeholders when not provided
  // placeholder name per-property: new_property1, new_property2, ...
  const placeholderName = `new_property${idx + 1}`
  const placeholderDescription = `Description for ${placeholderName}`
      const placeholderDataType = 'text'
      const placeholderTokenization = 'word'

      const finalBaseType = baseType || placeholderDataType

      const result = {
        name: p.name && p.name.trim() !== '' ? p.name : placeholderName,
        dataType: [typeValue || (p.isArray ? `${placeholderDataType}[]` : placeholderDataType)]
      }

      // Only add description if it's not empty and not the placeholder
      if (p.description && p.description.trim() !== '' && p.description !== placeholderDescription) {
        result.description = p.description
      }

      // Always include indexFilterable (true or false)
      result.indexFilterable = p.indexFilterable ?? true

      // Add indexSearchable only for text type
      if (finalBaseType === 'text') {
        // English: Always include indexSearchable for text type
        result.indexSearchable = p.indexSearchable ?? true
        // Always include tokenization for text type
        result.tokenization = p.tokenization || 'word'
      } else {
        // If not text type, set indexSearchable to false
        result.indexSearchable = false
      }

      // Add indexRangeFilters only for int, number, date types and only if true
      if (finalBaseType === 'int' || finalBaseType === 'number' || finalBaseType === 'date') {
        result.indexRangeFilters = p.indexRangeFilters ?? false
      } else {
        // If not a range-filterable type, set to false
        result.indexRangeFilters = false
      }

      // Add moduleConfig for text properties with vectorization settings
      if (finalBaseType === 'text' && (p.vectorizePropertyName !== undefined)) {
        // Get the active vectorizers from vectorConfigs to create moduleConfig
        const activeVectorizers = vectorConfigs
          .filter(vc => vc.vectorizer && vc.vectorizer !== '')
          .map(vc => vc.vectorizer)
        
        // If we have vectorizers, create moduleConfig for each one
        if (activeVectorizers.length > 0) {
          result.moduleConfig = {}
          activeVectorizers.forEach(vectorizerName => {
            const config = {}
            if (p.vectorizePropertyName !== undefined) {
              config.vectorizePropertyName = p.vectorizePropertyName
            }
            if (Object.keys(config).length > 0) {
              result.moduleConfig[vectorizerName] = config
            }
          })
        }
      }

      return result
    })

    setGeneratedJson((prev) => ({ ...prev, properties: transformed }))
  }, [properties, vectorConfigs])

  // Transform vectorConfigs into vectorConfig object for JSON
  useEffect(() => {
    if (!vectorConfigs || vectorConfigs.length === 0) {
      setGeneratedJson((prev) => {
        const { vectorConfig, ...rest } = prev
        return rest
      })
      return
    }

    const vectorConfigObject = {}
    vectorConfigs.forEach((config, idx) => {
      const configName = config.name && config.name.trim() !== '' 
        ? config.name 
        : `vector_config_${idx + 1}`
      
      // If bringing own vectors, use 'none' as vectorizer
      const vectorizerName = config.bringOwnVectors ? 'none' : (config.vectorizer || 'none')
      
      // Build the vectorizer config only with non-empty values
      const moduleConfig = config.moduleConfig || {}
      const vectorizerConfig = {}
      
      // Only process moduleConfig if not bringing own vectors
      if (!config.bringOwnVectors) {
        // Only add moduleConfig fields that have values
        Object.keys(moduleConfig).forEach(key => {
          const value = moduleConfig[key]
          // Include the field if it has a meaningful value
          if (value !== undefined && value !== null && value !== '' && 
              !(Array.isArray(value) && value.length === 0)) {
            vectorizerConfig[key] = value
          }
        })
        
        // Add vectorizeClassName if it's explicitly set to true
        if (config.vectorizeClassName === true) {
          vectorizerConfig.vectorizeClassName = config.vectorizeClassName
        }
      }
      
      const vectorConfigEntry = {
        vectorizer: {
          [vectorizerName]: Object.keys(vectorizerConfig).length > 0 ? vectorizerConfig : {}
        },
        vectorIndexType: config.indexType || 'hnsw'
      }
      
      // Build indexConfig based on index type
      if (config.indexConfig && Object.keys(config.indexConfig).length > 0) {
        const indexConfig = {}
        
        if (config.indexType === 'dynamic') {
          // For dynamic index, include distanceMetric, threshold, hnsw, and flat
          if (config.indexConfig.distanceMetric && config.indexConfig.distanceMetric !== 'cosine') {
            indexConfig.distanceMetric = config.indexConfig.distanceMetric
          }
          
          if (config.indexConfig.threshold !== undefined && config.indexConfig.threshold !== 10000) {
            indexConfig.threshold = config.indexConfig.threshold
          }
          
          // Build HNSW config
          if (config.indexConfig.hnsw && Object.keys(config.indexConfig.hnsw).length > 0) {
            const hnswConfig = {}
            Object.keys(config.indexConfig.hnsw).forEach(key => {
              const value = config.indexConfig.hnsw[key]
              if (value !== undefined && value !== null && value !== '') {
                // Skip default values
                if (key === 'distanceMetric' && value === 'cosine') return
                if (key === 'efConstruction' && value === 128) return
                if (key === 'ef' && value === -1) return
                if (key === 'maxConnections' && value === 32) return
                if (key === 'dynamicEfMin' && value === 100) return
                if (key === 'dynamicEfMax' && value === 500) return
                if (key === 'dynamicEfFactor' && value === 8) return
                if (key === 'flatSearchCutoff' && value === 40000) return
                if (key === 'cleanupIntervalSeconds' && value === 300) return
                if (key === 'vectorCacheMaxObjects' && value === 1000000000000) return
                if (key === 'filterStrategy' && value === 'sweeping') return
                if (key === 'skip' && value === false) return
                // Skip quantizer field itself, we'll handle it separately
                if (key === 'quantizer') return
                hnswConfig[key] = value
              }
            })
            
            // Handle HNSW quantization
            if (config.indexConfig.hnsw.quantizer && config.indexConfig.hnsw.quantizer !== 'none') {
              const quantizerType = config.indexConfig.hnsw.quantizer
              const quantizerConfig = config.indexConfig.hnsw[quantizerType]
              
              if (quantizerConfig && Object.keys(quantizerConfig).length > 0) {
                const cleanedQuantizer = {}
                Object.keys(quantizerConfig).forEach(qKey => {
                  const qValue = quantizerConfig[qKey]
                  if (qValue !== undefined && qValue !== null && qValue !== '') {
                    cleanedQuantizer[qKey] = qValue
                  }
                })
                if (Object.keys(cleanedQuantizer).length > 0) {
                  hnswConfig[quantizerType] = cleanedQuantizer
                }
              }
            }
            
            if (Object.keys(hnswConfig).length > 0) {
              indexConfig.hnsw = hnswConfig
            }
          }
          
          // Build Flat config
          if (config.indexConfig.flat && Object.keys(config.indexConfig.flat).length > 0) {
            const flatConfig = {}
            Object.keys(config.indexConfig.flat).forEach(key => {
              const value = config.indexConfig.flat[key]
              if (value !== undefined && value !== null && value !== '') {
                // Skip default values
                if (key === 'distanceMetric' && value === 'cosine') return
                if (key === 'vectorCacheMaxObjects' && value === 1000000000000) return
                // Skip quantizer field itself, we'll handle it separately
                if (key === 'quantizer') return
                flatConfig[key] = value
              }
            })
            
            // Handle Flat quantization (only BQ for flat)
            if (config.indexConfig.flat.quantizer && config.indexConfig.flat.quantizer !== 'none') {
              const quantizerType = config.indexConfig.flat.quantizer
              const quantizerConfig = config.indexConfig.flat[quantizerType]
              
              if (quantizerConfig && Object.keys(quantizerConfig).length > 0) {
                const cleanedQuantizer = {}
                Object.keys(quantizerConfig).forEach(qKey => {
                  const qValue = quantizerConfig[qKey]
                  if (qValue !== undefined && qValue !== null && qValue !== '') {
                    cleanedQuantizer[qKey] = qValue
                  }
                })
                if (Object.keys(cleanedQuantizer).length > 0) {
                  flatConfig[quantizerType] = cleanedQuantizer
                }
              }
            }
            
            if (Object.keys(flatConfig).length > 0) {
              indexConfig.flat = flatConfig
            }
          }
        } else {
          // For non-dynamic index types (e.g., hnsw, flat), include known keys and skip defaults
          Object.keys(config.indexConfig).forEach(key => {
            const value = config.indexConfig[key]
            if (value === undefined || value === null || value === '') return
            // Map legacy 'distance' to 'distanceMetric'
            const outKey = key === 'distance' ? 'distanceMetric' : key
            // Skip hnsw/flat nested keys for non-dynamic types
            if (outKey === 'hnsw' || outKey === 'flat') return
            // Skip quantizer field if present (it's just for UI state)
            if (outKey === 'quantizer') return
            
            // Handle quantizer configs (pq, bq, sq) - include them as-is
            if (outKey === 'pq' || outKey === 'bq' || outKey === 'sq') {
              if (typeof value === 'object' && value !== null) {
                const cleanedQuantizer = {}
                Object.keys(value).forEach(qKey => {
                  const qValue = value[qKey]
                  if (qValue !== undefined && qValue !== null && qValue !== '') {
                    cleanedQuantizer[qKey] = qValue
                  }
                })
                if (Object.keys(cleanedQuantizer).length > 0) {
                  indexConfig[outKey] = cleanedQuantizer
                }
              }
              return
            }
            
            // Skip default values for HNSW
            if (outKey === 'distanceMetric' && value === 'cosine') return
            if (outKey === 'efConstruction' && value === 128) return
            if (outKey === 'ef' && value === -1) return
            if (outKey === 'maxConnections' && value === 32) return
            if (outKey === 'dynamicEfMin' && value === 100) return
            if (outKey === 'dynamicEfMax' && value === 500) return
            if (outKey === 'dynamicEfFactor' && value === 8) return
            if (outKey === 'flatSearchCutoff' && value === 40000) return
            if (outKey === 'cleanupIntervalSeconds' && value === 300) return
            if (outKey === 'vectorCacheMaxObjects' && value === 1000000000000) return
            if (outKey === 'filterStrategy' && value === 'sweeping') return
            if (outKey === 'skip' && value === false) return
            if (outKey === 'threshold' && value === 10000) return
            indexConfig[outKey] = value
          })
        }
        
        if (Object.keys(indexConfig).length > 0) {
          vectorConfigEntry.vectorIndexConfig = indexConfig
        }
      }
      
      // Note: No longer using separate quantizer field - quantizers are now in indexConfig directly
      
      vectorConfigObject[configName] = vectorConfigEntry
    })

    setGeneratedJson((prev) => ({ ...prev, vectorConfig: vectorConfigObject }))
  }, [vectorConfigs])

  function prettyJson() {
    return JSON.stringify(generatedJson, null, 2)
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(prettyJson())
      .then(() => {
        // You could add a toast notification here if desired
        alert('JSON copied to clipboard!')
      })
      .catch(err => {
        console.error('Failed to copy:', err)
      })
  }

  function sanitizeFilePart(str) {
    if (!str || typeof str !== 'string') return 'MyCollection'
    // Replace spaces with underscores, remove characters not allowed in filenames
    // Allow letters, numbers, underscores, hyphens
    const cleaned = str.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '')
    return cleaned || 'MyCollection'
  }

  function downloadJson() {
    try {
      const jsonText = prettyJson()
      const blob = new Blob([jsonText], { type: 'application/json;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const base = sanitizeFilePart(name || generatedJson.class || 'MyCollection')
      const a = document.createElement('a')
      a.href = url
      a.download = `${base}_weaviate_schema.json`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to download JSON:', err)
      alert('Could not download JSON file')
    }
  }

  return (
    <div className="card">
      <h2>Collection</h2>

      <div className="collapsible">
        <button
          className="collapsible-toggle"
          aria-expanded={openBasic}
          onClick={() => setOpenBasic((s) => !s)}
        >
          <span>Basic Settings</span>
          <span className="chev">{openBasic ? '▾' : '▸'}</span>
        </button>

        {openBasic && (
          <div className="collapsible-panel">
            <div className="field">
              <label>Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="MyCollection"
              />
            </div>

            <div className="field">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A Brand new collection"
              />
            </div>
          </div>
        )}

      </div>

      {/* Properties collapsible section */}
      <div className="collapsible" style={{ marginTop: 12 }}>
        <button
          className="collapsible-toggle"
          aria-expanded={openProperties}
          onClick={() => setOpenProperties((s) => !s)}
        >
          <span>Properties</span>
          <span className="chev">{openProperties ? '\u25be' : '\u25b8'}</span>
        </button>

        {openProperties && (
          <div className="collapsible-panel">
            <PropertySection properties={properties} onChange={setProperties} />
          </div>
        )}
      </div>

      {/* Vector Config collapsible section */}
      <div className="collapsible" style={{ marginTop: 12 }}>
        <button
          className="collapsible-toggle"
          aria-expanded={openVectorConfig}
          onClick={() => setOpenVectorConfig((s) => !s)}
        >
          <span>Vectorizer Configuration</span>
          <span className="chev">{openVectorConfig ? '\u25be' : '\u25b8'}</span>
        </button>

        {openVectorConfig && (
          <div className="collapsible-panel">
            <VectorConfigSection 
              vectorConfigs={vectorConfigs} 
              onChange={setVectorConfigs}
              availableModules={availableModules}
              properties={properties}
            />
          </div>
        )}
      </div>

      <div className="preview">
        <h3>Generated JSON</h3>
        <div className="json-wrapper">
          <pre className="json-block">{prettyJson()}</pre>
          <button className="copy-btn" onClick={copyToClipboard} title="Copy to clipboard">
            Copy
          </button>
          <button className="copy-btn" onClick={downloadJson} title="Download JSON" style={{ top: 44, right: 8 }}>
            Download
          </button>
        </div>
      </div>
    </div>
  )
}
