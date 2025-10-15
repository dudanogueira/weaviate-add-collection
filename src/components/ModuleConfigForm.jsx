import React from 'react'
import { getModuleConfigFields, hasConfigOptions } from '../utils/moduleConfigExtractor'

/**
 * Dynamic form component that renders configuration fields
 * for a specific vectorizer module based on its type definition
 */
export default function ModuleConfigForm({ moduleName, config = {}, onChange }) {
  if (!moduleName || !hasConfigOptions(moduleName)) {
    return null
  }

  const fields = getModuleConfigFields(moduleName)

  function updateField(fieldName, value) {
    onChange({
      ...config,
      [fieldName]: value
    })
  }

  function renderField(field) {
    const value = config[field.name] || ''
    const fieldId = `module-config-${field.name}`

    switch (field.type) {
      case 'boolean':
        return (
          <div key={field.name} className="field">
            <label htmlFor={fieldId}>
              <input
                id={fieldId}
                type="checkbox"
                checked={value || false}
                onChange={(e) => updateField(field.name, e.target.checked)}
                style={{ width: 'auto', marginRight: '8px' }}
              />
              {field.name}
              {field.required && <span style={{ color: 'red' }}> *</span>}
            </label>
            {field.description && (
              <small className="hint">{field.description}</small>
            )}
          </div>
        )

      case 'number':
        return (
          <div key={field.name} className="field">
            <label htmlFor={fieldId}>
              {field.name}
              {field.required && <span style={{ color: 'red' }}> *</span>}
            </label>
            <input
              id={fieldId}
              type="number"
              value={value}
              onChange={(e) => updateField(field.name, parseFloat(e.target.value) || '')}
              placeholder={`Enter ${field.name}`}
            />
            {field.description && (
              <small className="hint">{field.description}</small>
            )}
          </div>
        )

      case 'string[]':
        // For arrays, we'll use a comma-separated input for simplicity
        return (
          <div key={field.name} className="field">
            <label htmlFor={fieldId}>
              {field.name}
              {field.required && <span style={{ color: 'red' }}> *</span>}
            </label>
            <input
              id={fieldId}
              type="text"
              value={Array.isArray(value) ? value.join(', ') : value}
              onChange={(e) => {
                const arrayValue = e.target.value
                  .split(',')
                  .map(s => s.trim())
                  .filter(s => s.length > 0)
                updateField(field.name, arrayValue)
              }}
              placeholder={`Enter ${field.name} (comma-separated)`}
            />
            {field.description && (
              <small className="hint">{field.description}</small>
            )}
          </div>
        )

      case 'object':
        // For objects, we'll show a textarea with JSON
        return (
          <div key={field.name} className="field">
            <label htmlFor={fieldId}>
              {field.name}
              {field.required && <span style={{ color: 'red' }}> *</span>}
            </label>
            <textarea
              id={fieldId}
              value={typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value)
                  updateField(field.name, parsed)
                } catch {
                  // If invalid JSON, store as string temporarily
                  updateField(field.name, e.target.value)
                }
              }}
              placeholder={`Enter ${field.name} as JSON`}
              rows={4}
            />
            {field.description && (
              <small className="hint">{field.description}</small>
            )}
          </div>
        )

      case 'string':
      default:
        return (
          <div key={field.name} className="field">
            <label htmlFor={fieldId}>
              {field.name}
              {field.required && <span style={{ color: 'red' }}> *</span>}
            </label>
            <input
              id={fieldId}
              type="text"
              value={value}
              onChange={(e) => updateField(field.name, e.target.value)}
              placeholder={`Enter ${field.name}`}
            />
            {field.description && (
              <small className="hint">{field.description}</small>
            )}
          </div>
        )
    }
  }

  return (
    <div className="module-config-form">
      <div className="section-header" style={{ marginTop: '16px', marginBottom: '12px' }}>
        <h5>Module Configuration for {moduleName}</h5>
        <small className="hint">
          Configure the specific options for this vectorizer module
        </small>
      </div>
      {fields.map(field => renderField(field))}
    </div>
  )
}
