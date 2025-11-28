import React, { useState } from 'react'

export default function JsonSchemaImport({ onSchemaLoad }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [jsonInput, setJsonInput] = useState('')
  const [error, setError] = useState(null)

  const handleLoadSchema = () => {
    try {
      const parsed = JSON.parse(jsonInput)
      setError(null)
      onSchemaLoad(parsed)
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`)
    }
  }

  const handleClear = () => {
    setJsonInput('')
    setError(null)
  }

  return (
    <div className="card-section">
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          cursor: 'pointer',
          userSelect: 'none'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 style={{ margin: 0 }}>
          {isExpanded ? '▼' : '▶'} Import JSON Schema
        </h3>
        <small className="hint" style={{ cursor: 'pointer' }}>
          {isExpanded ? 'Click to collapse' : 'Click to expand'}
        </small>
      </div>

      {isExpanded && (
        <div style={{ marginTop: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Paste JSON Schema:
            </label>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='{"class": "Article", "description": "A news article", "properties": [...], ...}'
              rows={12}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                resize: 'vertical'
              }}
            />
          </div>
          
          {error && (
            <div style={{ 
              marginTop: '0.5rem', 
              padding: '0.5rem', 
              backgroundColor: '#fee', 
              color: '#c00',
              borderRadius: '4px',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={handleLoadSchema}
              disabled={!jsonInput.trim()}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: jsonInput.trim() ? '#4CAF50' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: jsonInput.trim() ? 'pointer' : 'not-allowed',
                fontWeight: 'bold'
              }}
            >
              Load Schema
            </button>
            <button 
              onClick={handleClear}
              disabled={!jsonInput}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: jsonInput ? '#f44336' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: jsonInput ? 'pointer' : 'not-allowed'
              }}
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
