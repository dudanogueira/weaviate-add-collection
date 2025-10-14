import React from 'react'
import PropertyItem from './PropertyItem'

const emptyProperty = () => ({
  name: '',
    dataType: 'text',
  description: '',
  indexFilterable: true,
  indexRangeFilters: false,
    indexSearchable: true,
    isArray: false,
  tokenization: 'word'
})

export default function PropertySection({ properties = [], onChange }) {
  // Do not synthesize a default empty property -- respect the provided array.
  const propsList = properties

  function updateAt(i, next) {
    const nextList = propsList.map((p, idx) => (idx === i ? next : p))
    onChange && onChange(nextList)
  }

  function deleteAt(i) {
    const nextList = propsList.filter((_, idx) => idx !== i)
    // Do NOT create a new empty property when the list becomes empty.
    onChange && onChange(nextList)
  }

  function addNew() {
    const nextList = [...propsList, emptyProperty()]
    onChange && onChange(nextList)
  }

  return (
    <div className="card property-section">
      <div className="section-header">
        <div>
          <button type="button" className="btn btn-primary" onClick={addNew}>Add property</button>
        </div>
      </div>

      <div className="section-body">
        {propsList.map((p, i) => (
          <PropertyItem key={i} index={i} value={p} onChange={(v) => updateAt(i, v)} onDelete={() => deleteAt(i)} />
        ))}
      </div>
    </div>
  )
}
