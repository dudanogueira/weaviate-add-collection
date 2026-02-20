import React from 'react';

// 'dateProperty' is an internal discriminator only — the JSON output uses the
// actual property name as the deleteOn value (e.g. "reference_date", "created_at", etc.)
const DELETE_ON_OPTIONS = [
  { value: 'none',         label: 'None (disabled)' },
  { value: 'creationTime', label: 'Delete by Creation Time' },
  { value: 'dateProperty', label: 'Delete by Date Property' },
  { value: 'updateTime',   label: 'Delete by Update Time' },
]

const ObjectTtlConfigSection = ({ config, setConfig, properties = [] }) => {
  const update = (field, value) => setConfig({ ...config, [field]: value })

  const dateProperties = properties.filter(p => p.dataType === 'date')
  const mode = config.mode || 'none'
  const isActive = mode !== 'none'
  const isDateProperty = mode === 'dateProperty'

  return (
    <div>
      <div className="field">
        <label>Delete On:</label>
        <select value={mode} onChange={e => update('mode', e.target.value)}>
          {DELETE_ON_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {isActive && (
        <>
          {isDateProperty && (
            <div className="field">
              <label>Date Property:</label>
              <select
                value={config.propertyName || ''}
                onChange={e => update('propertyName', e.target.value)}
              >
                <option value="">Select a date property…</option>
                {dateProperties.map(p => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
              </select>
              {dateProperties.length === 0 && (
                <small className="help-text">No date-type properties found. Add a property with type <em>date</em> first.</small>
              )}
            </div>
          )}

          <div className="field">
            <label>{isDateProperty ? 'TTL Offset (seconds):' : 'Time to Live (seconds):'}</label>
            <input
              type="number"
              min="0"
              value={config.timeToLive ?? ''}
              onChange={e => update('timeToLive', e.target.value === '' ? '' : parseInt(e.target.value, 10))}
            />
          </div>

          <div className="field">
            <label>Filter Expired Objects:</label>
            <input
              type="checkbox"
              checked={config.filterExpiredObjects || false}
              onChange={e => update('filterExpiredObjects', e.target.checked)}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default ObjectTtlConfigSection
