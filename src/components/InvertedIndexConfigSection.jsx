import React from 'react';
import TagInput from './TagInput';
import { DEFAULT_INVERTED_INDEX_CONFIG } from '../constants/invertedIndexDefaults';

const InvertedIndexConfigSection = ({ config = DEFAULT_INVERTED_INDEX_CONFIG, setConfig }) => {
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
