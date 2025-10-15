import React, { useState } from 'react'
import { indexTypeOptions, getVectorizerModuleOptions } from '../constants/options'
import ModuleConfigForm from './ModuleConfigForm'

export default function VectorConfigItem({ 
  value, 
  onChange, 
  onDelete, 
  index,
  availableModules = null 
}) {
  const [activeTab, setActiveTab] = useState('vectorizer')
  const vectorizerOptions = getVectorizerModuleOptions(availableModules)

  function update(field, val) {
    onChange({ ...value, [field]: val })
  }

  function updateModuleConfig(moduleConfig) {
    update('moduleConfig', moduleConfig)
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

        {/* Vectorize Class Name - common to all modules */}
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
                        value={value.indexConfig?.maxConnections || 64}
                        onChange={(e) => update('indexConfig', { ...value.indexConfig, maxConnections: parseInt(e.target.value) || 64 })}
                        placeholder="64"
                      />
                      <small className="hint">Number of connections per node (default: 64)</small>
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
                      <label>Threshold</label>
                      <input
                        type="number"
                        value={value.indexConfig?.threshold || 10000}
                        onChange={(e) => update('indexConfig', { ...value.indexConfig, threshold: parseInt(e.target.value) || 10000 })}
                        placeholder="10000"
                      />
                      <small className="hint">Number of objects before switching from flat to HNSW (default: 10000)</small>
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
