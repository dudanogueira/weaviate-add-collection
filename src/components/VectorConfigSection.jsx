import React from 'react'
import VectorConfigItem from './VectorConfigItem'

const emptyVectorConfig = (index = 0) => ({
  name: index === 0 ? 'default' : '',
  vectorizer: '',
  indexType: 'hnsw'
})

export default function VectorConfigSection({ 
  vectorConfigs = [], 
  onChange,
  availableModules = null,
  properties = []
}) {
  const configsList = vectorConfigs

  function updateAt(i, next) {
    const nextList = configsList.map((c, idx) => (idx === i ? next : c))
    onChange && onChange(nextList)
  }

  function deleteAt(i) {
    const nextList = configsList.filter((_, idx) => idx !== i)
    onChange && onChange(nextList)
  }

  function addNew() {
    const nextList = [...configsList, emptyVectorConfig(configsList.length)]
    onChange && onChange(nextList)
  }

  return (
    <div className="card property-section">
      <div className="section-body">
        {configsList.length === 0 && (
          <p className="hint" style={{ textAlign: 'center', padding: '20px' }}>
            No vector configurations yet. Click "Add Vector Config" to create one.
          </p>
        )}
        {configsList.map((c, i) => (
          <VectorConfigItem
            key={i}
            index={i}
            value={c}
            onChange={(v) => updateAt(i, v)}
            onDelete={() => deleteAt(i)}
            availableModules={availableModules}
            properties={properties}
          />
        ))}
      </div>
      <div className="section-footer">
        <div></div> {/* Empty div for flexbox spacing */}
        <div>
          <button type="button" className="btn btn-primary" onClick={addNew}>
            Add Vector Config
          </button>
        </div>
      </div>
    </div>
  )
}
