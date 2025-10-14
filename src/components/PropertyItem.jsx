import React from 'react'
import { tokenizationOptions, dataTypeOptions } from '../constants/options'

export default function PropertyItem({ value, onChange, onDelete, index }) {
  function update(key, val) {
    onChange({ ...value, [key]: val })
  }

  function updateDataType(val) {
    update('dataType', val)
  }

  return (
    <div className="property-item card">
      <div className="property-header">
        <strong>Property {index + 1}</strong>
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
        <input value={value.name || ''} onChange={(e) => update('name', e.target.value)} placeholder={`new_property${index + 1}`} />
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
        <div className="field">
          <label>Tokenization</label>
          <select value={value.tokenization || 'word'} onChange={(e) => update('tokenization', e.target.value)}>
            {tokenizationOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
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
