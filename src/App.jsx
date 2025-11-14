import React, { useState } from 'react'
import Collection from './components/Collection'

export default function App() {
  const [importedJson, setImportedJson] = useState(null)
  const [currentSchema, setCurrentSchema] = useState(null)
  // Example: You can pass availableModules from your server
  // const [availableModules, setAvailableModules] = useState(null)
  // Example: You can pass nodesNumber to limit the maximum replication factor
  // const [nodesNumber, setNodesNumber] = useState(3)

  function handleFileImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result)
        setImportedJson(parsed)
      } catch (err) {
        alert('Invalid JSON file')
      }
    }
    reader.readAsText(file)
  }

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
        <div className="import-row">
          <div>
            <label className="file-label">Import JSON schema:</label>
            <small className="hint">You can also pass JSON directly as a prop to the component.</small>
          </div>
          <input type="file" accept="application/json" onChange={handleFileImport} />
        </div>
      </div>

      <Collection 
        initialJson={importedJson} 
        onChange={handleSchemaChange}
        onSubmit={handleSubmit}
        // availableModules={availableModules} // Optional: pass server modules here
        // nodesNumber={nodesNumber} // Optional: pass number of nodes to limit replication factor
      />
    </div>
  )
}
