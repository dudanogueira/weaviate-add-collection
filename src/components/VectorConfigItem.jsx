import React from 'react'
import { indexTypeOptions, getVectorizerModuleOptions } from '../constants/options'

export default function VectorConfigItem({ 
  value, 
  onChange, 
  onDelete, 
  index,
  availableModules = null 
}) {
  const vectorizerOptions = getVectorizerModuleOptions(availableModules)

  function update(field, val) {
    onChange({ ...value, [field]: val })
  }

  return (
    <div className="property-item">
      <div className="property-item-header">
        <h4>Vector Config #{index + 1}</h4>
        <button 
          type="button" 
          className="btn btn-danger btn-sm" 
          onClick={onDelete}
          title="Delete this vector config"
        >
          Delete
        </button>
      </div>

      <div className="property-item-body">
        <div className="field">
          <label>Name</label>
          <input
            type="text"
            value={value.name || ''}
            onChange={(e) => update('name', e.target.value)}
            placeholder="e.g., default, semantic, contextual"
          />
          <small className="hint">Unique name for this vector configuration</small>
        </div>

        <div className="field">
          <label>Vectorizer Module</label>
          <select
            value={value.vectorizer || ''}
            onChange={(e) => update('vectorizer', e.target.value)}
          >
            <option value="">Select a vectorizer module...</option>
            {vectorizerOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {value.vectorizer && vectorizerOptions.find(opt => opt.value === value.vectorizer)?.documentationHref && (
            <small className="hint">
              <a 
                href={vectorizerOptions.find(opt => opt.value === value.vectorizer).documentationHref} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                View documentation ↗
              </a>
            </small>
          )}
        </div>

        <div className="field">
          <label>Index Type</label>
          <select
            value={value.indexType || 'hnsw'}
            onChange={(e) => update('indexType', e.target.value)}
          >
            {indexTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <small className="hint">
            {indexTypeOptions.find(opt => opt.value === (value.indexType || 'hnsw'))?.description}
          </small>
        </div>
      </div>
    </div>
  )
}
