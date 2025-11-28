import React from 'react'

/**
 * Reusable component for rendering module configuration fields
 * Used by GenerativeConfigSection and RerankerConfigSection
 */
export default function ModuleConfigField({ field, value, onChange, idPrefix = 'config' }) {
  const fieldId = `${idPrefix}-${field.name}`

  switch (field.type) {
    case 'boolean':
      return (
        <div key={field.name} className="field">
          <label htmlFor={fieldId}>
            <input
              id={fieldId}
              type="checkbox"
              checked={value || false}
              onChange={(e) => onChange(field.name, e.target.checked)}
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
            onChange={(e) => onChange(field.name, parseFloat(e.target.value) || '')}
            placeholder={`Enter ${field.name}`}
          />
          {field.description && (
            <small className="hint">{field.description}</small>
          )}
        </div>
      )

    case 'string[]':
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
              onChange(field.name, arrayValue)
            }}
            placeholder={`Enter ${field.name} (comma-separated)`}
          />
          {field.description && (
            <small className="hint">{field.description}</small>
          )}
        </div>
      )

    case 'object':
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
                onChange(field.name, parsed)
              } catch {
                onChange(field.name, e.target.value)
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
            onChange={(e) => onChange(field.name, e.target.value)}
            placeholder={`Enter ${field.name}`}
          />
          {field.description && (
            <small className="hint">{field.description}</small>
          )}
        </div>
      )
  }
}
