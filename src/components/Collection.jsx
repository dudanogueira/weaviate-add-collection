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
        
        return {
          name: p.name || '',
          dataType: baseDataType,
          description: p.description || '',
          indexFilterable: p.indexFilterable ?? true,
          indexRangeFilters: p.indexRangeFilters ?? false,
          indexSearchable: p.indexSearchable ?? true,
          isArray: isArrayType,
          tokenization: p.tokenization || 'word'
        }
      }))
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

      // Only add indexFilterable if it's explicitly set to false (true is default)
      if (p.indexFilterable === false) {
        result.indexFilterable = false
      }

      // Add indexSearchable only for text type
      if (finalBaseType === 'text') {
        // Only add if it's explicitly set to false (true is default)
        if (p.indexSearchable === false) {
          result.indexSearchable = false
        }
        // Only add tokenization if it's not the default 'word'
        if (p.tokenization && p.tokenization !== 'word') {
          result.tokenization = p.tokenization
        }
      } else {
        // If not text type, set indexSearchable to false
        result.indexSearchable = false
      }

      // Add indexRangeFilters only for int, number, date types and only if true
      if (finalBaseType === 'int' || finalBaseType === 'number' || finalBaseType === 'date') {
        if (p.indexRangeFilters === true) {
          result.indexRangeFilters = true
        }
      } else {
        // If not a range-filterable type, set to false
        result.indexRangeFilters = false
      }

      return result
    })

    setGeneratedJson((prev) => ({ ...prev, properties: transformed }))
  }, [properties])

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
      
      // Build the vectorizer config only with non-empty values
      const moduleConfig = config.moduleConfig || {}
      const vectorizerConfig = {}
      
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
      
      const vectorConfigEntry = {
        vectorizer: {
          [config.vectorizer || 'none']: Object.keys(vectorizerConfig).length > 0 ? vectorizerConfig : {}
        },
        vectorIndexType: config.indexType || 'hnsw'
      }
      
      // Build indexConfig only with non-default/non-empty values
      if (config.indexConfig && Object.keys(config.indexConfig).length > 0) {
        const indexConfig = {}
        Object.keys(config.indexConfig).forEach(key => {
          const value = config.indexConfig[key]
          // Only include non-default values
          if (value !== undefined && value !== null && value !== '') {
            // Skip default values
            if (key === 'distance' && value === 'cosine') return
            if (key === 'efConstruction' && value === 128) return
            if (key === 'ef' && value === -1) return
            if (key === 'maxConnections' && value === 64) return
            if (key === 'threshold' && value === 10000) return
            indexConfig[key] = value
          }
        })
        if (Object.keys(indexConfig).length > 0) {
          vectorConfigEntry.vectorIndexConfig = indexConfig
        }
      }
      
      // Add quantization if it exists and type is not 'none'
      if (config.quantization && config.quantization.type && config.quantization.type !== 'none') {
        const quantization = { type: config.quantization.type }
        // Only add other quantization fields if they have values
        Object.keys(config.quantization).forEach(key => {
          if (key !== 'type') {
            const value = config.quantization[key]
            if (value !== undefined && value !== null && value !== '' && value !== 0) {
              quantization[key] = value
            }
          }
        })
        vectorConfigEntry.quantizer = quantization
      }
      
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
