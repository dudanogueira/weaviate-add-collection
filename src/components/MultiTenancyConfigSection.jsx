import React from 'react';
import { VersionGated } from '../context/VersionContext';

const defaultConfig = {
  enabled: false,
  autoTenantCreation: false,
  autoTenantActivation: false,
};

const MultiTenancyConfigSection = ({ config, setConfig }) => {
  const update = (field, value) => {
    setConfig({ ...config, [field]: value });
  };

  return (
    <div>
      <div className="field">
        <label>Enabled:</label>
        <input 
          type="checkbox" 
          checked={config.enabled} 
          onChange={e => update('enabled', e.target.checked)} 
        />
      </div>
      {config.enabled && (
        <>
          <VersionGated featureId="autoTenantCreation">
            <div className="field">
              <label>Auto Tenant Creation:</label>
              <input
                type="checkbox"
                checked={config.autoTenantCreation}
                onChange={e => update('autoTenantCreation', e.target.checked)}
              />
            </div>
          </VersionGated>
          <VersionGated featureId="autoTenantActivation">
            <div className="field">
              <label>Auto Tenant Activation:</label>
              <input
                type="checkbox"
                checked={config.autoTenantActivation}
                onChange={e => update('autoTenantActivation', e.target.checked)}
              />
            </div>
          </VersionGated>
        </>
      )}
    </div>
  );
};

export default MultiTenancyConfigSection;
