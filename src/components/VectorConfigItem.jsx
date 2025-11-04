import React, { useState } from 'react'
import { indexTypeOptions, getVectorizerModuleOptions } from '../constants/options'
import ModuleConfigForm from './ModuleConfigForm'

export default function VectorConfigItem({ 
  value, 
  onChange, 
  onDelete, 
  index,
  availableModules = null,
  properties = []
}) {
  const [activeTab, setActiveTab] = useState('vectorizer')
  const [dynamicSubTab, setDynamicSubTab] = useState('hnsw')
  const vectorizerOptions = getVectorizerModuleOptions(availableModules)

  function update(field, val) {
    onChange({ ...value, [field]: val })
  }

  function updateModuleConfig(moduleConfig) {
    update('moduleConfig', moduleConfig)
  }

  // Handle property selection for vectorization
  function handlePropertyToggle(propertyName) {
    const currentProperties = value.moduleConfig?.properties || []
    const isSelected = currentProperties.includes(propertyName)
    
    let newProperties
    if (isSelected) {
      // Remove property
      newProperties = currentProperties.filter(p => p !== propertyName)
    } else {
      // Add property
      newProperties = [...currentProperties, propertyName]
    }
    
    updateModuleConfig({
      ...value.moduleConfig,
      properties: newProperties
    })
  }

  function selectAllProperties() {
    // Only select text properties
    const textPropertyNames = properties
      .filter(p => p.dataType === 'text')
      .map(p => p.name)
      .filter(name => name && name.trim() !== '')
    
    updateModuleConfig({
      ...value.moduleConfig,
      properties: textPropertyNames
    })
  }

  function deselectAllProperties() {
    updateModuleConfig({
      ...value.moduleConfig,
      properties: []
    })
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
        {/* Basic fields - always visible */}
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

        {/* Bring my own vectors toggle */}
        <div className="field">
          <label htmlFor={`bring-own-vectors-${index}`}>
            <input
              id={`bring-own-vectors-${index}`}
              type="checkbox"
              checked={value.bringOwnVectors || false}
              onChange={(e) => update('bringOwnVectors', e.target.checked)}
              style={{ width: 'auto', marginRight: '8px' }}
            />
            I will bring my own vectors
          </label>
          <small className="hint">Check this if you will provide pre-computed vectors instead of using a vectorizer</small>
        </div>

        {/* Vectorize Class Name - common to all modules - hidden when bringing own vectors */}
        {!value.bringOwnVectors && (
          <div className="field">
            <label htmlFor={`vectorize-class-name-${index}`}>
              <input
                id={`vectorize-class-name-${index}`}
                type="checkbox"
                checked={value.vectorizeClassName || false}
                onChange={(e) => update('vectorizeClassName', e.target.checked)}
                style={{ width: 'auto', marginRight: '8px' }}
              />
              Vectorize Class Name
            </label>
            <small className="hint">Whether to vectorize the collection/class name</small>
          </div>
        )}

        {/* Property Selection for Vectorization - hidden when bringing own vectors */}
        {!value.bringOwnVectors && properties.length > 0 && (
          <div className="field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ marginBottom: 0 }}>Properties to Vectorize</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={selectAllProperties}
                  style={{ fontSize: '12px', padding: '4px 8px' }}
                >
                  Select All
                </button>
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={deselectAllProperties}
                  style={{ fontSize: '12px', padding: '4px 8px' }}
                >
                  Deselect All
                </button>
              </div>
            </div>
            <div style={{ 
              border: '1px solid #ddd', 
              borderRadius: '4px', 
              padding: '12px',
              maxHeight: '200px',
              overflowY: 'auto',
              backgroundColor: '#f9f9f9'
            }}>
              {properties.filter(p => p.dataType === 'text').length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '20px', 
                  color: '#666',
                  fontSize: '14px'
                }}>
                  No text properties available. Only text fields can be vectorized.
                </div>
              ) : (
                properties
                  .filter(property => property.dataType === 'text')
                  .map((property, idx) => {
                    const propertyName = property.name || `new_property${idx + 1}`
                    const isSelected = (value.moduleConfig?.properties || []).includes(propertyName)
                    
                    return (
                      <div key={idx} style={{ marginBottom: '8px' }}>
                        <label 
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handlePropertyToggle(propertyName)}
                            style={{ width: 'auto', marginRight: '8px' }}
                          />
                          <span style={{ fontWeight: isSelected ? '600' : '400' }}>
                            {propertyName}
                          </span>
                          {property.dataType && (
                            <span style={{ 
                              marginLeft: '8px', 
                              color: '#666', 
                              fontSize: '12px',
                              fontStyle: 'italic'
                            }}>
                              ({property.dataType}{property.isArray ? '[]' : ''})
                            </span>
                          )}
                        </label>
                      </div>
                    )
                  })
              )}
            </div>
            <small className="hint">
              Only text properties can be vectorized. Select which text properties should be included in this vector
              {(value.moduleConfig?.properties || []).length > 0 && (
                <span style={{ marginLeft: '8px', fontWeight: '600' }}>
                  ({(value.moduleConfig?.properties || []).length} selected)
                </span>
              )}
            </small>
          </div>
        )}

        {/* Tabs */}
        <div className="tabs">
          <div className="tabs-header">
            <button
              type="button"
              className={`tab-button ${activeTab === 'vectorizer' ? 'active' : ''}`}
              onClick={() => setActiveTab('vectorizer')}
            >
              Vectorizer Module
            </button>
            <button
              type="button"
              className={`tab-button ${activeTab === 'index' ? 'active' : ''}`}
              onClick={() => setActiveTab('index')}
            >
              Index Configuration
            </button>
            <button
              type="button"
              className={`tab-button ${activeTab === 'compression' ? 'active' : ''}`}
              onClick={() => setActiveTab('compression')}
            >
              Compression/Quantization
            </button>
          </div>

          <div className="tabs-content">
            {/* Tab 1: Vectorizer Module */}
            {activeTab === 'vectorizer' && (
              <div className="tab-panel">
                {value.bringOwnVectors ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                    <p>Vectorizer configuration is disabled when bringing your own vectors.</p>
                    <small className="hint">You will provide pre-computed vectors directly, so no vectorizer is needed.</small>
                  </div>
                ) : (
                  <>
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

                    {/* Dynamic module configuration form based on selected vectorizer */}
                    {value.vectorizer && (
                      <ModuleConfigForm
                        moduleName={value.vectorizer}
                        config={value.moduleConfig || {}}
                        onChange={updateModuleConfig}
                      />
                    )}
                  </>
                )}
              </div>
            )}

            {/* Tab 2: Index Configuration */}
            {activeTab === 'index' && (
              <div className="tab-panel">
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

                {/* HNSW Configuration */}
                {(value.indexType === 'hnsw' || !value.indexType) && (
                  <div style={{ marginTop: '16px' }}>
                    <h5 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>HNSW Parameters</h5>
                    
                    <div className="field">
                      <label>Distance Metric</label>
                      <select
                        value={value.indexConfig?.distance || 'cosine'}
                        onChange={(e) => update('indexConfig', { ...value.indexConfig, distance: e.target.value })}
                      >
                        <option value="cosine">Cosine</option>
                        <option value="dot">Dot Product</option>
                        <option value="l2-squared">L2 Squared</option>
                        <option value="manhattan">Manhattan</option>
                        <option value="hamming">Hamming</option>
                      </select>
                      <small className="hint">Distance metric for vector comparison</small>
                    </div>

                    <div className="field">
                      <label>ef Construction</label>
                      <input
                        type="number"
                        value={value.indexConfig?.efConstruction || 128}
                        onChange={(e) => update('indexConfig', { ...value.indexConfig, efConstruction: parseInt(e.target.value) || 128 })}
                        placeholder="128"
                      />
                      <small className="hint">Higher values = better quality, slower indexing (default: 128)</small>
                    </div>

                    <div className="field">
                      <label>ef</label>
                      <input
                        type="number"
                        value={value.indexConfig?.ef || -1}
                        onChange={(e) => update('indexConfig', { ...value.indexConfig, ef: parseInt(e.target.value) || -1 })}
                        placeholder="-1 (dynamic)"
                      />
                      <small className="hint">Higher values = better recall, slower search (default: -1 = dynamic)</small>
                    </div>

                    <div className="field">
                      <label>Max Connections</label>
                      <input
                        type="number"
                        value={value.indexConfig?.maxConnections || 32}
                        onChange={(e) => update('indexConfig', { ...value.indexConfig, maxConnections: parseInt(e.target.value) || 32 })}
                        placeholder="32"
                      />
                      <small className="hint">Number of connections per node (default: 32)</small>
                    </div>
                  </div>
                )}

                {/* Flat Index Configuration */}
                {value.indexType === 'flat' && (
                  <div style={{ marginTop: '16px' }}>
                    <h5 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>Flat Index Parameters</h5>
                    
                    <div className="field">
                      <label>Distance Metric</label>
                      <select
                        value={value.indexConfig?.distance || 'cosine'}
                        onChange={(e) => update('indexConfig', { ...value.indexConfig, distance: e.target.value })}
                      >
                        <option value="cosine">Cosine</option>
                        <option value="dot">Dot Product</option>
                        <option value="l2-squared">L2 Squared</option>
                        <option value="manhattan">Manhattan</option>
                        <option value="hamming">Hamming</option>
                      </select>
                      <small className="hint">Distance metric for vector comparison</small>
                    </div>
                  </div>
                )}

                {/* Dynamic Index Configuration */}
                {value.indexType === 'dynamic' && (
                  <div style={{ marginTop: '16px' }}>
                    <h5 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>Dynamic Index Parameters</h5>
                    
                    <div className="field">
                      <label>Distance Metric</label>
                      <select
                        value={value.indexConfig?.distanceMetric || 'cosine'}
                        onChange={(e) => update('indexConfig', { ...value.indexConfig, distanceMetric: e.target.value })}
                      >
                        <option value="cosine">Cosine</option>
                        <option value="dot">Dot Product</option>
                        <option value="l2-squared">L2 Squared</option>
                        <option value="manhattan">Manhattan</option>
                        <option value="hamming">Hamming</option>
                      </select>
                      <small className="hint">Distance metric for vector comparison</small>
                    </div>

                    <div className="field">
                      <label>Threshold</label>
                      <input
                        type="number"
                        value={value.indexConfig?.threshold || 10000}
                        onChange={(e) => update('indexConfig', { ...value.indexConfig, threshold: parseInt(e.target.value) || 10000 })}
                        placeholder="10000"
                      />
                      <small className="hint">Number of objects before switching from flat to HNSW (default: 10000)</small>
                    </div>

                    {/* Sub-tabs for HNSW and Flat configurations */}
                    <div className="tabs" style={{ marginTop: '16px' }}>
                      <div className="tabs-header">
                        <button
                          type="button"
                          className={`tab-button ${dynamicSubTab === 'hnsw' ? 'active' : ''}`}
                          onClick={() => setDynamicSubTab('hnsw')}
                        >
                          HNSW Config
                        </button>
                        <button
                          type="button"
                          className={`tab-button ${dynamicSubTab === 'flat' ? 'active' : ''}`}
                          onClick={() => setDynamicSubTab('flat')}
                        >
                          Flat Config
                        </button>
                      </div>

                      <div className="tabs-content">
                        {/* HNSW Configuration for Dynamic */}
                        {dynamicSubTab === 'hnsw' && (
                          <div className="tab-panel">
                            <h6 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: 500 }}>HNSW Parameters</h6>
                            
                            <div className="field">
                              <label>Distance Metric</label>
                              <select
                                value={value.indexConfig?.hnsw?.distanceMetric || 'cosine'}
                                onChange={(e) => update('indexConfig', { 
                                  ...value.indexConfig, 
                                  hnsw: { ...(value.indexConfig?.hnsw || {}), distanceMetric: e.target.value }
                                })}
                              >
                                <option value="cosine">Cosine</option>
                                <option value="dot">Dot Product</option>
                                <option value="l2-squared">L2 Squared</option>
                                <option value="manhattan">Manhattan</option>
                                <option value="hamming">Hamming</option>
                              </select>
                              <small className="hint">Distance metric for HNSW index</small>
                            </div>

                            <div className="field">
                              <label>ef Construction</label>
                              <input
                                type="number"
                                value={value.indexConfig?.hnsw?.efConstruction || 128}
                                onChange={(e) => update('indexConfig', { 
                                  ...value.indexConfig, 
                                  hnsw: { ...(value.indexConfig?.hnsw || {}), efConstruction: parseInt(e.target.value) || 128 }
                                })}
                                placeholder="128"
                              />
                              <small className="hint">Higher values = better quality, slower indexing (default: 128)</small>
                            </div>

                            <div className="field">
                              <label>ef</label>
                              <input
                                type="number"
                                value={value.indexConfig?.hnsw?.ef || -1}
                                onChange={(e) => update('indexConfig', { 
                                  ...value.indexConfig, 
                                  hnsw: { ...(value.indexConfig?.hnsw || {}), ef: parseInt(e.target.value) || -1 }
                                })}
                                placeholder="-1 (dynamic)"
                              />
                              <small className="hint">Higher values = better recall, slower search (default: -1 = dynamic)</small>
                            </div>

                            <div className="field">
                              <label>Max Connections</label>
                              <input
                                type="number"
                                value={value.indexConfig?.hnsw?.maxConnections || 32}
                                onChange={(e) => update('indexConfig', { 
                                  ...value.indexConfig, 
                                  hnsw: { ...(value.indexConfig?.hnsw || {}), maxConnections: parseInt(e.target.value) || 32 }
                                })}
                                placeholder="32"
                              />
                              <small className="hint">Number of connections per node (default: 32)</small>
                            </div>

                            <div className="field">
                              <label>Dynamic Ef Min</label>
                              <input
                                type="number"
                                value={value.indexConfig?.hnsw?.dynamicEfMin || 100}
                                onChange={(e) => update('indexConfig', { 
                                  ...value.indexConfig, 
                                  hnsw: { ...(value.indexConfig?.hnsw || {}), dynamicEfMin: parseInt(e.target.value) || 100 }
                                })}
                                placeholder="100"
                              />
                              <small className="hint">Minimum value for dynamic ef (default: 100)</small>
                            </div>

                            <div className="field">
                              <label>Dynamic Ef Max</label>
                              <input
                                type="number"
                                value={value.indexConfig?.hnsw?.dynamicEfMax || 500}
                                onChange={(e) => update('indexConfig', { 
                                  ...value.indexConfig, 
                                  hnsw: { ...(value.indexConfig?.hnsw || {}), dynamicEfMax: parseInt(e.target.value) || 500 }
                                })}
                                placeholder="500"
                              />
                              <small className="hint">Maximum value for dynamic ef (default: 500)</small>
                            </div>

                            <div className="field">
                              <label>Dynamic Ef Factor</label>
                              <input
                                type="number"
                                value={value.indexConfig?.hnsw?.dynamicEfFactor || 8}
                                onChange={(e) => update('indexConfig', { 
                                  ...value.indexConfig, 
                                  hnsw: { ...(value.indexConfig?.hnsw || {}), dynamicEfFactor: parseInt(e.target.value) || 8 }
                                })}
                                placeholder="8"
                              />
                              <small className="hint">Factor for dynamic ef calculation (default: 8)</small>
                            </div>

                            <div className="field">
                              <label>Flat Search Cutoff</label>
                              <input
                                type="number"
                                value={value.indexConfig?.hnsw?.flatSearchCutoff || 40000}
                                onChange={(e) => update('indexConfig', { 
                                  ...value.indexConfig, 
                                  hnsw: { ...(value.indexConfig?.hnsw || {}), flatSearchCutoff: parseInt(e.target.value) || 40000 }
                                })}
                                placeholder="40000"
                              />
                              <small className="hint">When to use flat search instead (default: 40000)</small>
                            </div>

                            <div className="field">
                              <label>Cleanup Interval Seconds</label>
                              <input
                                type="number"
                                value={value.indexConfig?.hnsw?.cleanupIntervalSeconds || 300}
                                onChange={(e) => update('indexConfig', { 
                                  ...value.indexConfig, 
                                  hnsw: { ...(value.indexConfig?.hnsw || {}), cleanupIntervalSeconds: parseInt(e.target.value) || 300 }
                                })}
                                placeholder="300"
                              />
                              <small className="hint">Interval between cleanup operations (default: 300)</small>
                            </div>

                            <div className="field">
                              <label>Vector Cache Max Objects</label>
                              <input
                                type="number"
                                value={value.indexConfig?.hnsw?.vectorCacheMaxObjects || 1000000000000}
                                onChange={(e) => update('indexConfig', { 
                                  ...value.indexConfig, 
                                  hnsw: { ...(value.indexConfig?.hnsw || {}), vectorCacheMaxObjects: parseInt(e.target.value) || 1000000000000 }
                                })}
                                placeholder="1000000000000"
                              />
                              <small className="hint">Maximum objects in vector cache (default: 1000000000000)</small>
                            </div>

                            <div className="field">
                              <label>Filter Strategy</label>
                              <select
                                value={value.indexConfig?.hnsw?.filterStrategy || 'sweeping'}
                                onChange={(e) => update('indexConfig', { 
                                  ...value.indexConfig, 
                                  hnsw: { ...(value.indexConfig?.hnsw || {}), filterStrategy: e.target.value }
                                })}
                              >
                                <option value="sweeping">Sweeping</option>
                                <option value="acorn">Acorn</option>
                              </select>
                              <small className="hint">Strategy for filtering results (default: sweeping)</small>
                            </div>

                            <div className="field">
                              <label htmlFor={`hnsw-skip-${index}`}>
                                <input
                                  id={`hnsw-skip-${index}`}
                                  type="checkbox"
                                  checked={value.indexConfig?.hnsw?.skip || false}
                                  onChange={(e) => update('indexConfig', { 
                                    ...value.indexConfig, 
                                    hnsw: { ...(value.indexConfig?.hnsw || {}), skip: e.target.checked }
                                  })}
                                  style={{ width: 'auto', marginRight: '8px' }}
                                />
                                Skip HNSW Index
                              </label>
                              <small className="hint">Skip building the HNSW index (default: false)</small>
                            </div>
                          </div>
                        )}

                        {/* Flat Configuration for Dynamic */}
                        {dynamicSubTab === 'flat' && (
                          <div className="tab-panel">
                            <h6 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: 500 }}>Flat Parameters</h6>
                            
                            <div className="field">
                              <label>Distance Metric</label>
                              <select
                                value={value.indexConfig?.flat?.distanceMetric || 'cosine'}
                                onChange={(e) => update('indexConfig', { 
                                  ...value.indexConfig, 
                                  flat: { ...(value.indexConfig?.flat || {}), distanceMetric: e.target.value }
                                })}
                              >
                                <option value="cosine">Cosine</option>
                                <option value="dot">Dot Product</option>
                                <option value="l2-squared">L2 Squared</option>
                                <option value="manhattan">Manhattan</option>
                                <option value="hamming">Hamming</option>
                              </select>
                              <small className="hint">Distance metric for Flat index</small>
                            </div>

                            <div className="field">
                              <label>Vector Cache Max Objects</label>
                              <input
                                type="number"
                                value={value.indexConfig?.flat?.vectorCacheMaxObjects || 1000000000000}
                                onChange={(e) => update('indexConfig', { 
                                  ...value.indexConfig, 
                                  flat: { ...(value.indexConfig?.flat || {}), vectorCacheMaxObjects: parseInt(e.target.value) || 1000000000000 }
                                })}
                                placeholder="1000000000000"
                              />
                              <small className="hint">Maximum objects in vector cache (default: 1000000000000)</small>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Compression/Quantization */}
            {activeTab === 'compression' && (
              <div className="tab-panel">
                <div className="field">
                  <label>Quantization Type</label>
                  <select
                    value={value.quantization?.type || 'none'}
                    onChange={(e) => update('quantization', { ...value.quantization, type: e.target.value })}
                  >
                    <option value="none">None</option>
                    <option value="pq">Product Quantization (PQ)</option>
                    <option value="bq">Binary Quantization (BQ)</option>
                    <option value="sq">Scalar Quantization (SQ)</option>
                  </select>
                  <small className="hint">Compression method to reduce memory usage</small>
                </div>

                {/* Product Quantization Configuration */}
                {value.quantization?.type === 'pq' && (
                  <div style={{ marginTop: '16px' }}>
                    <h5 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>Product Quantization Settings</h5>
                    
                    <div className="field">
                      <label>Segments</label>
                      <input
                        type="number"
                        value={value.quantization?.segments || 0}
                        onChange={(e) => update('quantization', { ...value.quantization, type: 'pq', segments: parseInt(e.target.value) || 0 })}
                        placeholder="0 (auto)"
                      />
                      <small className="hint">Number of segments (0 = auto, recommended: 0, 96, 128, 256)</small>
                    </div>

                    <div className="field">
                      <label>Centroids</label>
                      <input
                        type="number"
                        value={value.quantization?.centroids || 256}
                        onChange={(e) => update('quantization', { ...value.quantization, type: 'pq', centroids: parseInt(e.target.value) || 256 })}
                        placeholder="256"
                      />
                      <small className="hint">Number of centroids per segment (default: 256)</small>
                    </div>

                    <div className="field">
                      <label htmlFor={`pq-training-limit-${index}`}>
                        <input
                          id={`pq-training-limit-${index}`}
                          type="checkbox"
                          checked={value.quantization?.trainingLimit !== undefined}
                          onChange={(e) => {
                            if (e.target.checked) {
                              update('quantization', { ...value.quantization, type: 'pq', trainingLimit: 100000 })
                            } else {
                              const { trainingLimit, ...rest } = value.quantization || {}
                              update('quantization', rest)
                            }
                          }}
                          style={{ width: 'auto', marginRight: '8px' }}
                        />
                        Set Training Limit
                      </label>
                      {value.quantization?.trainingLimit !== undefined && (
                        <input
                          type="number"
                          value={value.quantization?.trainingLimit || 100000}
                          onChange={(e) => update('quantization', { ...value.quantization, type: 'pq', trainingLimit: parseInt(e.target.value) || 100000 })}
                          placeholder="100000"
                          style={{ marginTop: '8px' }}
                        />
                      )}
                      <small className="hint">Maximum number of vectors used for training</small>
                    </div>

                    <div className="field">
                      <label htmlFor={`pq-encoder-distribution-${index}`}>
                        <input
                          id={`pq-encoder-distribution-${index}`}
                          type="checkbox"
                          checked={value.quantization?.encoder?.distribution || false}
                          onChange={(e) => update('quantization', { 
                            ...value.quantization, 
                            type: 'pq',
                            encoder: { 
                              ...(value.quantization?.encoder || {}),
                              distribution: e.target.checked ? 'log-normal' : undefined 
                            }
                          })}
                          style={{ width: 'auto', marginRight: '8px' }}
                        />
                        Use Log-Normal Distribution
                      </label>
                      <small className="hint">Enable for data with log-normal distribution</small>
                    </div>
                  </div>
                )}

                {/* Binary Quantization Configuration */}
                {value.quantization?.type === 'bq' && (
                  <div style={{ marginTop: '16px' }}>
                    <h5 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>Binary Quantization Settings</h5>
                    
                    <div className="field">
                      <label htmlFor={`bq-rescore-limit-${index}`}>
                        <input
                          id={`bq-rescore-limit-${index}`}
                          type="checkbox"
                          checked={value.quantization?.rescoreLimit !== undefined}
                          onChange={(e) => {
                            if (e.target.checked) {
                              update('quantization', { ...value.quantization, type: 'bq', rescoreLimit: -1 })
                            } else {
                              const { rescoreLimit, ...rest } = value.quantization || {}
                              update('quantization', rest)
                            }
                          }}
                          style={{ width: 'auto', marginRight: '8px' }}
                        />
                        Set Rescore Limit
                      </label>
                      {value.quantization?.rescoreLimit !== undefined && (
                        <input
                          type="number"
                          value={value.quantization?.rescoreLimit || -1}
                          onChange={(e) => update('quantization', { ...value.quantization, type: 'bq', rescoreLimit: parseInt(e.target.value) })}
                          placeholder="-1 (unlimited)"
                          style={{ marginTop: '8px' }}
                        />
                      )}
                      <small className="hint">Number of candidates to rescore (-1 = unlimited)</small>
                    </div>
                  </div>
                )}

                {/* Scalar Quantization Configuration */}
                {value.quantization?.type === 'sq' && (
                  <div style={{ marginTop: '16px' }}>
                    <h5 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>Scalar Quantization Settings</h5>
                    
                    <div className="field">
                      <label htmlFor={`sq-rescore-limit-${index}`}>
                        <input
                          id={`sq-rescore-limit-${index}`}
                          type="checkbox"
                          checked={value.quantization?.rescoreLimit !== undefined}
                          onChange={(e) => {
                            if (e.target.checked) {
                              update('quantization', { ...value.quantization, type: 'sq', rescoreLimit: -1 })
                            } else {
                              const { rescoreLimit, ...rest } = value.quantization || {}
                              update('quantization', rest)
                            }
                          }}
                          style={{ width: 'auto', marginRight: '8px' }}
                        />
                        Set Rescore Limit
                      </label>
                      {value.quantization?.rescoreLimit !== undefined && (
                        <input
                          type="number"
                          value={value.quantization?.rescoreLimit || -1}
                          onChange={(e) => update('quantization', { ...value.quantization, type: 'sq', rescoreLimit: parseInt(e.target.value) })}
                          placeholder="-1 (unlimited)"
                          style={{ marginTop: '8px' }}
                        />
                      )}
                      <small className="hint">Number of candidates to rescore (-1 = unlimited)</small>
                    </div>

                    <div className="field">
                      <label htmlFor={`sq-training-limit-${index}`}>
                        <input
                          id={`sq-training-limit-${index}`}
                          type="checkbox"
                          checked={value.quantization?.trainingLimit !== undefined}
                          onChange={(e) => {
                            if (e.target.checked) {
                              update('quantization', { ...value.quantization, type: 'sq', trainingLimit: 100000 })
                            } else {
                              const { trainingLimit, ...rest } = value.quantization || {}
                              update('quantization', rest)
                            }
                          }}
                          style={{ width: 'auto', marginRight: '8px' }}
                        />
                        Set Training Limit
                      </label>
                      {value.quantization?.trainingLimit !== undefined && (
                        <input
                          type="number"
                          value={value.quantization?.trainingLimit || 100000}
                          onChange={(e) => update('quantization', { ...value.quantization, type: 'sq', trainingLimit: parseInt(e.target.value) || 100000 })}
                          placeholder="100000"
                          style={{ marginTop: '8px' }}
                        />
                      )}
                      <small className="hint">Maximum number of vectors used for training</small>
                    </div>
                  </div>
                )}

                {value.quantization?.type === 'none' && (
                  <div style={{ marginTop: '16px', padding: '16px', background: '#f9fafb', borderRadius: '6px' }}>
                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                      No compression is applied. Vectors are stored in full precision.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
