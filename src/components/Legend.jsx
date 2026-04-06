import React from 'react';

const Legend = () => {
  return (
    <div className="floating-ui legend">
      <div className="legend-header">
        <div className="legend-title">HerWay Chicago</div>
        <div className="legend-subtitle">Community Safety Signals</div>
      </div>
      
      <div className="legend-items">
        <div className="legend-item">
          <div className="legend-dot high"></div>
          <span>High Risk</span>
        </div>
        
        <div className="legend-item">
          <div className="legend-dot medium"></div>
          <span>Medium Risk</span>
        </div>
        
        <div className="legend-item">
          <div className="legend-dot low"></div>
          <span>Lower Risk</span>
        </div>
      </div>

      <div className="legend-footer">
        <div className="legend-note">Circle size = incident volume</div>
        <div className="legend-note">Hover to preview</div>
        <div className="legend-note">Click for full analysis</div>
      </div>
    </div>
  );
};

export default Legend;