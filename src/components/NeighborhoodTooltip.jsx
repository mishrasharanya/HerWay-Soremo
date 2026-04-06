import React from 'react';
import { formatNumber, formatPercent } from '../utils/dataLoader';

const NeighborhoodTooltip = ({ data, position }) => {
  if (!data || !position) return null;

  const { 
    neighborhood, 
    crime_total_incidents,
    crime_top_types,
    crime_peak_hour,
    crime_peak_day,
    requests_311_total,
    most_common_complaint
  } = data;

  // Format crime types to be more readable
  const formatCrimeTypes = (types) => {
    if (!types) return 'N/A';
    return types.split(' | ').slice(0, 2).join(', ');
  };

  return (
    <div 
      className="hover-tooltip"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -110%)'
      }}
      data-testid="neighborhood-tooltip"
    >
      <div className="tooltip-name">{neighborhood}</div>
      
      <div className="tooltip-section">
        <div className="tooltip-label">Crime Incidents (Annual)</div>
        <div className="tooltip-value">{formatNumber(crime_total_incidents)}</div>
      </div>

      <div className="tooltip-section">
        <div className="tooltip-label">Common Issues</div>
        <div className="tooltip-value">{formatCrimeTypes(crime_top_types)}</div>
      </div>

      <div className="tooltip-section">
        <div className="tooltip-label">311 Complaints</div>
        <div className="tooltip-value">
          {formatNumber(requests_311_total)} — {most_common_complaint || 'N/A'}
        </div>
      </div>

      {crime_peak_hour && (
        <div className="tooltip-caution">
          <div className="tooltip-caution-label">Peak Incident Time</div>
          <div className="tooltip-value">{crime_peak_hour} · {crime_peak_day}s</div>
        </div>
      )}
    </div>
  );
};

export default NeighborhoodTooltip;


