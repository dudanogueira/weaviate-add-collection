import React, { useState, useEffect } from 'react'
import Collection from './components/Collection'
import JsonSchemaImport from './components/JsonSchemaImport'

export default function App() {
  const [importedJson, setImportedJson] = useState(null)
  const [currentSchema, setCurrentSchema] = useState(null)
  const [nodesNumber, setNodesNumber] = useState(null)
  const [weaviateVersion, setWeaviateVersion] = useState('')
  // Example: You can pass availableModules from your server
  // const [availableModules, setAvailableModules] = useState(null)

  // Read nodesNumber from URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const nodes = params.get('nodesNumber')
    if (nodes) {
      const parsed = parseInt(nodes, 10)
      if (!isNaN(parsed) && parsed > 0) {
        setNodesNumber(parsed)
      }
    }
  }, [])

  // Example: onChange callback to track schema changes
  const handleSchemaChange = (schema) => {
    setCurrentSchema(schema)
    console.log('Schema updated:', schema)
  }

  // Example: onSubmit callback to create collection
  const handleSubmit = async (schema) => {
    console.log('Creating collection with schema:', schema)
    
    // Example: Send to your Weaviate instance
    // Uncomment and modify the URL to match your Weaviate instance
    /*
    try {
      const response = await fetch('http://localhost:8080/v1/schema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schema)
      })
      if (response.ok) {
        alert('Collection created successfully!')
      } else {
        const error = await response.json()
        alert(`Failed to create collection: ${error.error?.[0]?.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Failed to create collection:', error)
      alert(`Error: ${error.message}`)
    }
    */
    
    // For demo purposes, just show an alert
    alert(`Would create collection: ${schema.class}\n\nCheck console for full schema.`)
  }

  return (
    <div className="container">
      <div className="card-header">
        <h1>Weaviate — Add Collection</h1>
      </div>
      
      <div className="card-section">
        <label className="file-label">Weaviate Server Version (optional):</label>
        <input
          type="text"
          value={weaviateVersion}
          onChange={(e) => setWeaviateVersion(e.target.value)}
          placeholder="e.g. 1.24.0 — leave blank to show all features"
          style={{ width: '280px' }}
        />
        <small className="hint">Fields unavailable in this version will be greyed out with a tooltip</small>
      </div>

      <JsonSchemaImport onSchemaLoad={setImportedJson} />

      <Collection
        initialJson={importedJson}
        onChange={handleSchemaChange}
        onSubmit={handleSubmit}
        nodesNumber={nodesNumber}
        hideCreateButton={true}
        weaviateVersion={weaviateVersion || null}
        // availableModules={availableModules} // Optional: pass server modules here
      />
    </div>
  )
}
