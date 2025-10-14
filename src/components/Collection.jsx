import React, { useEffect, useState } from 'react'
import PropertySection from './PropertySection'

// Contract:
// Inputs: optional `initialJson` object with { name, description }
// Outputs: none for now; component displays generated JSON and allows editing fields.

export default function Collection({ initialJson = null }) {
  const [name, setName] = useState(initialJson?.name || '')
  const [description, setDescription] = useState(initialJson?.description || '')
  const [generatedJson, setGeneratedJson] = useState({})
  const [openBasic, setOpenBasic] = useState(true)
  const [openProperties, setOpenProperties] = useState(true)

  useEffect(() => {
    setName(initialJson?.name || '')
    setDescription(initialJson?.description || '')
    // Also load properties from imported JSON
    if (initialJson?.properties && Array.isArray(initialJson.properties)) {
      setProperties(initialJson.properties.map(p => ({
        name: p.name || '',
        dataType: Array.isArray(p.dataType) ? p.dataType[0]?.replace('[]', '') : (p.dataType || 'text'),
        description: p.description || '',
        indexFilterable: p.indexFilterable ?? true,
        indexRangeFilters: p.indexRangeFilters ?? false,
        indexSearchable: p.indexSearchable ?? true,
        isArray: Array.isArray(p.dataType) ? p.dataType[0]?.includes('[]') : false,
        tokenization: p.tokenization || 'word'
      })))
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

  useEffect(() => {
    // Transform properties into final JSON shape:
    const transformed = (properties || []).map((p, idx) => {
      const baseType = typeof p.dataType === 'string' ? p.dataType : (Array.isArray(p.dataType) ? p.dataType[0] : 'text')
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
        dataType: [typeValue || (p.isArray ? `${placeholderDataType}[]` : placeholderDataType)],
        description: p.description && p.description.trim() !== '' ? p.description : placeholderDescription,
        indexFilterable: typeof p.indexFilterable === 'boolean' ? p.indexFilterable : true
      }

      // Add indexSearchable only for text type
      if (finalBaseType === 'text') {
        result.indexSearchable = typeof p.indexSearchable === 'boolean' ? p.indexSearchable : true
        result.tokenization = p.tokenization || placeholderTokenization
      } else {
        // If not text type, set indexSearchable to false
        result.indexSearchable = false
      }

      // Add indexRangeFilters only for int, number, date types
      if (finalBaseType === 'int' || finalBaseType === 'number' || finalBaseType === 'date') {
        result.indexRangeFilters = typeof p.indexRangeFilters === 'boolean' ? p.indexRangeFilters : false
      } else {
        // If not a range-filterable type, set to false
        result.indexRangeFilters = false
      }

      return result
    })

    setGeneratedJson((prev) => ({ ...prev, properties: transformed }))
  }, [properties])

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

      <div className="preview">
        <h3>Generated JSON</h3>
        <div className="json-wrapper">
          <pre className="json-block">{prettyJson()}</pre>
          <button className="copy-btn" onClick={copyToClipboard} title="Copy to clipboard">
            Copy
          </button>
        </div>
      </div>
    </div>
  )
}
