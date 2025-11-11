import React from 'react'
import { allAvailableModules } from '../constants/options'
import { getGenerativeConfigFields, hasGenerativeConfigOptions } from '../utils/moduleConfigExtractor'

/**
 * Component for configuring generative search capabilities (RAG)
 */
export default function GenerativeConfigSection({ config, setConfig }) {
  const generativeModules = Object.entries(allAvailableModules)
    .filter(([key]) => key.startsWith('generative-'))
    .map(([key, value]) => ({
      value: key,
      label: value.name || key,
      documentationHref: value.documentationHref
    }))
    .sort((a, b) => a.label.localeCompare(b.label))

  const update = (field, value) => {
    setConfig({ ...config, [field]: value })
  }

  const updateModuleConfig = (field, value) => {
    update('moduleConfig', {
      ...config.moduleConfig,
      [field]: value
    })
  }

  function renderModuleConfigField(field) {
    const moduleConfig = config.moduleConfig || {}
    const value = moduleConfig[field.name] || ''
    const fieldId = `generative-config-${field.name}`

    switch (field.type) {
      case 'boolean':
        return (
          <div key={field.name} className="field">
            <label htmlFor={fieldId}>
              <input
                id={fieldId}
                type="checkbox"
                checked={value || false}
                onChange={(e) => updateModuleConfig(field.name, e.target.checked)}
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
              onChange={(e) => updateModuleConfig(field.name, parseFloat(e.target.value) || '')}
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
                updateModuleConfig(field.name, arrayValue)
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
                  updateModuleConfig(field.name, parsed)
                } catch {
                  updateModuleConfig(field.name, e.target.value)
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
              onChange={(e) => updateModuleConfig(field.name, e.target.value)}
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
    <div>
      <div className="field">
        <label htmlFor="generative-enabled">
          <input
            id="generative-enabled"
            type="checkbox"
            checked={config.enabled || false}
            onChange={(e) => update('enabled', e.target.checked)}
            style={{ width: 'auto', marginRight: '8px' }}
          />
          Enable Generative Search
        </label>
        <small className="hint">
          This allows you to use generative AI models to generate responses based on your data.
        </small>
      </div>

      {config.enabled && (
        <>
          <div className="field">
            <label htmlFor="generative-module">Generative Module</label>
            <select
              id="generative-module"
              value={config.module || ''}
              onChange={(e) => {
                // Update both module and reset module config at the same time
                setConfig({
                  ...config,
                  module: e.target.value,
                  moduleConfig: {}
                })
              }}
              disabled={!config.enabled}
            >
              <option value="">Select a generative module...</option>
              {generativeModules.map((mod) => (
                <option key={mod.value} value={mod.value}>
                  {mod.label}
                </option>
              ))}
            </select>
            {config.module && (
              <>
                <small className="hint">
                  {generativeModules.find((m) => m.value === config.module)?.documentationHref && (
                    <a
                      href={generativeModules.find((m) => m.value === config.module).documentationHref}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View documentation ↗
                    </a>
                  )}
                </small>
              </>
            )}
          </div>

          {config.module && hasGenerativeConfigOptions(config.module) && (
            <div style={{ marginTop: '16px' }}>
              <h5 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>
                Module Configuration for {config.module}
              </h5>
              {getGenerativeConfigFields(config.module).map((field) => renderModuleConfigField(field))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
