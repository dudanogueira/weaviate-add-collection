import React from 'react';
import { VersionGated } from '../context/VersionContext';
import DOC_LINKS from '../constants/docLinks.json';

const defaultConfig = {
  factor: 1,
  asyncEnabled: false,
  deletionStrategy: 'NoAutomatedResolution',
};

const ReplicationConfigSection = ({ config, setConfig, nodesNumber = null }) => {
  const update = (field, value) => {
    setConfig({ ...config, [field]: value });
  };

  // Determine the maximum replication factor based on nodesNumber
  const maxFactor = nodesNumber && nodesNumber > 0 ? nodesNumber : 100;

  return (
    <div>
        
      <div className="field">
        <label>Replication Factor:</label>
        <input 
          type="number" 
          min="1"
          max={maxFactor}
          value={config.factor === null ? '' : config.factor} 
          onChange={e => {
            const val = e.target.value;
            update('factor', val === '' ? null : parseInt(val, 10) || null);
          }}
          placeholder="1"
        />
        {nodesNumber && nodesNumber > 0 ? (
          <small className="hint">Maximum: {maxFactor} (based on number of nodes)</small>
        ) : (
          <small className="hint">Feature available for clusters with multiple nodes</small>
        )}
      </div>
      {config.factor !== null && config.factor >= 2 && (
        <>
          <VersionGated featureId="replicationAsyncEnabled">
            <div className="field">
              <label>
                Async Enabled:
                {DOC_LINKS.replicationAsyncEnabled && (
                  <a href={DOC_LINKS.replicationAsyncEnabled} target="_blank" rel="noopener noreferrer" title="View documentation" style={{ marginLeft: '6px', verticalAlign: 'middle' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="View documentation">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                  </a>
                )}
              </label>
              <input
                type="checkbox"
                checked={config.asyncEnabled}
                onChange={e => update('asyncEnabled', e.target.checked)}
              />
            </div>
          </VersionGated>
          <VersionGated featureId="replicationDeletionStrategy">
            {config.asyncEnabled && (
              <div className="field">
                <label>Deletion Strategy:</label>
                <select
                  value={config.deletionStrategy}
                  onChange={e => update('deletionStrategy', e.target.value)}
                >
                  <option value="NoAutomatedResolution">NoAutomatedResolution</option>
                  <option value="DeleteOnConflict">DeleteOnConflict</option>
                  <option value="TimeBasedResolution">TimeBasedResolution</option>
                </select>
              </div>
            )}
          </VersionGated>
        </>
      )}
    </div>
  );
};

export default ReplicationConfigSection;
