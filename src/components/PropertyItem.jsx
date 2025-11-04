import React, { useState, useEffect } from 'react'
import { tokenizationOptions, dataTypeOptions } from '../constants/options'
import { validatePropertyName, sanitizePropertyName } from '../utils/propertyNameValidator'

export default function PropertyItem({ value, onChange, onDelete, index }) {
  const [nameValidation, setNameValidation] = useState({ valid: true, error: null, warning: null })
  
  useEffect(() => {
    // Validate the name whenever it changes
    if (value.name) {
      const validation = validatePropertyName(value.name)
      setNameValidation(validation)
    } else {
      setNameValidation({ valid: true, error: null, warning: null })
    }
  }, [value.name])
  
  function update(key, val) {
    onChange({ ...value, [key]: val })
  }
  
  function handleNameChange(newName) {
    update('name', newName)
  }
  
  function handleNameBlur() {
    // Auto-sanitize on blur if invalid
    if (value.name && !nameValidation.valid) {
      const sanitized = sanitizePropertyName(value.name)
      if (sanitized !== value.name) {
        update('name', sanitized)
      }
    }
  }

  function updateDataType(val) {
    // When changing data type, reset type-specific properties
    const newValue = {
      name: value.name,
      description: value.description,
      dataType: val,
      isArray: value.isArray,
      indexFilterable: value.indexFilterable
    }
    
    // Only add properties relevant to the new data type
    if (val === 'text') {
      newValue.tokenization = 'word'
      newValue.indexSearchable = true
    } else if (val === 'int' || val === 'number' || val === 'date') {
      newValue.indexRangeFilters = false
    }
    
    onChange(newValue)
  }

  return (
    <div className="property-item card">
      <div className="property-header">
        <strong>{value.name && value.name.trim() !== '' ? value.name : `Property ${index + 1}`}</strong>
        <div>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onDelete && onDelete()}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="field">
        <label>Name</label>
        <input 
          value={value.name || ''} 
          onChange={(e) => handleNameChange(e.target.value)} 
          onBlur={handleNameBlur}
          placeholder={`new_property${index + 1}`}
          className={!nameValidation.valid ? 'input-error' : ''}
        />
        {nameValidation.error && (
          <small className="error-text" style={{ color: '#dc2626', display: 'block', marginTop: '4px' }}>
            ❌ {nameValidation.error}
          </small>
        )}
        {nameValidation.warning && (
          <small className="warning-text" style={{ color: '#f59e0b', display: 'block', marginTop: '4px' }}>
            ⚠️ {nameValidation.warning}
          </small>
        )}
        {nameValidation.valid && !nameValidation.warning && value.name && (
          <small className="success-text" style={{ color: '#10b981', display: 'block', marginTop: '4px' }}>
            ✓ Valid property name
          </small>
        )}
      </div>
      <div className="field">
        <label>Description</label>
        <textarea value={value.description || ''} onChange={(e) => update('description', e.target.value)} placeholder={`Description for new_property${index + 1}`} />
      </div>      

      <div className="field field--row">
        <div className="data-type-group">
          <label className="data-type-label">Data Type</label>
          <select className="data-type-select" value={value.dataType || 'text'} onChange={(e) => updateDataType(e.target.value)}>
            {dataTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="array-group">
          <label className="array-label">
            <input type="checkbox" checked={!!value.isArray} onChange={(e) => update('isArray', e.target.checked)} />
            <span>array</span>
          </label>
        </div>
      </div>

      {value.dataType === 'text' && (
        <>
          <div className="field">
            <label>Tokenization</label>
            <select value={value.tokenization || 'word'} onChange={(e) => update('tokenization', e.target.value)}>
              {tokenizationOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <small className="help-text">
              {tokenizationOptions.find(opt => opt.value === (value.tokenization || 'word'))?.description}
            </small>
          </div>

          <div className="field">
            <h5 style={{ margin: '12px 0 8px 0', fontSize: '14px', fontWeight: 600 }}>Vectorization Settings (per-property)</h5>
            <small className="hint" style={{ display: 'block', marginBottom: '12px' }}>
              Configure how this property should be vectorized. These settings apply to all vectorizers unless overridden.
            </small>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={value.vectorizePropertyName || false}
                  onChange={(e) => update('vectorizePropertyName', e.target.checked)}
                  style={{ width: 'auto', marginRight: '8px' }}
                />
                <span>Vectorize Property Name</span>
              </label>
              <small className="hint" style={{ marginLeft: '24px', marginTop: '-4px' }}>
                Include the property name itself when creating embeddings
              </small>
            </div>
          </div>
        </>
      )}



      <div className="row">
        <label><input type="checkbox" checked={!!value.indexFilterable} onChange={(e) => update('indexFilterable', e.target.checked)} /> indexFilterable</label>
        {value.dataType === 'text' && (
          <label><input type="checkbox" checked={!!value.indexSearchable} onChange={(e) => update('indexSearchable', e.target.checked)} /> indexSearchable</label>
        )}
        {(value.dataType === 'int' || value.dataType === 'number' || value.dataType === 'date') && (
          <label><input type="checkbox" checked={!!value.indexRangeFilters} onChange={(e) => update('indexRangeFilters', e.target.checked)} /> indexRangeFilters</label>
        )}
      </div>


    </div>
  )
}
