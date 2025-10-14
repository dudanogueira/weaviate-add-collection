import React, { useEffect, useState } from 'react'

// Contract:
// Inputs: optional `initialJson` object with { name, description }
// Outputs: none for now; component displays generated JSON and allows editing fields.

export default function Collection({ initialJson = null }) {
  const [name, setName] = useState(initialJson?.name || '')
  const [description, setDescription] = useState(initialJson?.description || '')
  const [generatedJson, setGeneratedJson] = useState({})
  const [openBasic, setOpenBasic] = useState(true)

  useEffect(() => {
    setName(initialJson?.name || '')
    setDescription(initialJson?.description || '')
  }, [initialJson])

  useEffect(() => {
    const j = {
      name: name || 'MyCollection',
      description: description || 'A Brand new collection'
    }
    setGeneratedJson(j)
  }, [name, description])

  function prettyJson() {
    return JSON.stringify(generatedJson, null, 2)
  }

  return (
    <div className="card">
      <h2>Collection</h2>

      <div className="collapsible">
        <button
          className="collapsible-toggle"
          aria-expanded={openBasic}
          onClick={() => setOpenBasic((s) => !s)}
        >
          <span>Basic Settings</span>
          <span className="chev">{openBasic ? '▾' : '▸'}</span>
        </button>

        {openBasic && (
          <div className="collapsible-panel">
            <div className="field">
              <label>Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="MyCollection"
              />
            </div>

            <div className="field">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A Brand new collection"
              />
            </div>
          </div>
        )}
      </div>

      <div className="preview">
        <h3>Generated JSON</h3>
        <pre className="json-block">{prettyJson()}</pre>
      </div>
    </div>
  )
}
