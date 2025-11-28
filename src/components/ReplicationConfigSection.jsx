import React from 'react';

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
          value={config.factor} 
          onChange={e => update('factor', parseInt(e.target.value, 10) || 1)} 
        />
        {nodesNumber && nodesNumber > 0 ? (
          <small className="hint">Maximum: {maxFactor} (based on number of nodes)</small>
        ) : (
          <small className="hint">Feature available for clusters with multiple nodes</small>
        )}
      </div>
      {config.factor >= 2 && (
        <>
          <div className="field">
            <label>Async Enabled:</label>
            <input 
              type="checkbox" 
              checked={config.asyncEnabled} 
              onChange={e => update('asyncEnabled', e.target.checked)}
            />
          </div>
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
        </>
      )}
    </div>
  );
};

export default ReplicationConfigSection;
