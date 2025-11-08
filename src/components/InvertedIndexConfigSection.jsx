import React, { useState } from 'react';

const defaultConfig = {
  bm25_b: 0.75,
  bm25_k1: 1.2,
  cleanup_interval_seconds: 60,
  index_timestamps: false,
  index_property_length: false,
  index_null_state: false,
  stopwords_preset: 'en',
  stopwords_additions: [],
  stopwords_removals: [],
};

function TagInput({ tags, setTags, label }) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const value = input.trim();
    if (value && !tags.includes(value)) {
      setTags([...tags, value]);
      setInput('');
    }
  };

  const removeTag = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <div className="tag-input-section">
      <label>{label}</label>
      <div className="tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '6px' }}>
        {tags.map(tag => (
          <span key={tag} className="tag" style={{
            background: '#e0e7ef',
            borderRadius: '16px',
            padding: '4px 12px',
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: '0.95em',
            color: '#2a3a4d',
            border: '1px solid #b6c2d6',
          }}>
            {tag}
            <button type="button" onClick={() => removeTag(tag)} style={{
              marginLeft: '8px',
              background: 'none',
              border: 'none',
              color: '#6b7a90',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1em',
              lineHeight: '1',
            }}>&times;</button>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '6px' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder="Add tag"
          style={{ flex: 1, padding: '4px 8px', borderRadius: '8px', border: '1px solid #b6c2d6' }}
        />
        <button type="button" onClick={addTag} style={{
          padding: '4px 12px',
          borderRadius: '8px',
          border: '1px solid #b6c2d6',
          background: '#f5f8fa',
          color: '#2a3a4d',
          cursor: 'pointer',
        }}>Add</button>
      </div>
    </div>
  );
}

const InvertedIndexConfigSection = ({ config, setConfig }) => {
  const update = (field, value) => {
    setConfig({ ...config, [field]: value });
  };

  return (
    <div>
      <div className="field">
        <label>BM25 b:</label>
        <input type="number" step="0.01" value={config.bm25_b} onChange={e => update('bm25_b', parseFloat(e.target.value))} />
      </div>
      <div className="field">
        <label>BM25 k1:</label>
        <input type="number" step="0.01" value={config.bm25_k1} onChange={e => update('bm25_k1', parseFloat(e.target.value))} />
      </div>
      <div className="field">
        <label>Cleanup Interval (s):</label>
        <input type="number" value={config.cleanup_interval_seconds} onChange={e => update('cleanup_interval_seconds', parseInt(e.target.value))} />
      </div>
      <div className="field">
        <label>Index Timestamps:</label>
        <input type="checkbox" checked={config.index_timestamps} onChange={e => update('index_timestamps', e.target.checked)} />
      </div>
      <div className="field">
        <label>Index Property Length:</label>
        <input type="checkbox" checked={config.index_property_length} onChange={e => update('index_property_length', e.target.checked)} />
      </div>
      <div className="field">
        <label>Index Null State:</label>
        <input type="checkbox" checked={config.index_null_state} onChange={e => update('index_null_state', e.target.checked)} />
      </div>
      <div className="field">
        <label>Stopwords Preset:</label>
        <select value={config.stopwords_preset} onChange={e => update('stopwords_preset', e.target.value)}>
          <option value="en">en</option>
          <option value="none">none</option>
        </select>
      </div>
      <div className="field">
        <TagInput tags={config.stopwords_additions} setTags={tags => update('stopwords_additions', tags)} label="Stopwords Additions" />
      </div>
      <div className="field">
        <TagInput tags={config.stopwords_removals} setTags={tags => update('stopwords_removals', tags)} label="Stopwords Removals" />
      </div>
    </div>
  );
};

export default InvertedIndexConfigSection;
