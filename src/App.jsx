import React, { useState } from 'react'
import Collection from './components/Collection'

export default function App() {
  const [importedJson, setImportedJson] = useState(null)
  // Example: You can pass availableModules from your server
  // const [availableModules, setAvailableModules] = useState(null)

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

  return (
    <div className="container">
      <h1>Weaviate — Add Collection</h1>

      <div className="import-row">
        <label className="file-label">Import JSON schema:</label>
        <input type="file" accept="application/json" onChange={handleFileImport} />
        <small className="hint">You can also pass JSON directly as a prop to the component.</small>
      </div>

      <Collection 
        initialJson={importedJson} 
        // availableModules={availableModules} // Optional: pass server modules here
      />
    </div>
  )
}
