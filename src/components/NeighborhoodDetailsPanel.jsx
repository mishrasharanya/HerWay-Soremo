import React from 'react';
import { X } from 'lucide-react';
import { 
  formatNumber, 
  formatPercent, 
  formatHours,
  formatScore 
} from '../utils/dataLoader';

const NeighborhoodDetailsPanel = ({ data, onClose }) => {
  if (!data) return null;

  const {
    neighborhood,
    crime_total_incidents,
    crime_top_types,
    crime_violent_pct,
    crime_peak_hour,
    crime_peak_day,
    crime_peak_month,
    crime_top_location,
    crime_night_pct,
    requests_311_total,
    avg_resolution_hours,
    street_light_complaints,
    vacant_building_complaints,
    most_common_complaint,
    reddit_total_posts,
    reddit_fear_ratio,
    reddit_positive_reassuring,
    reddit_neutral_concern
  } = data;

  return (
    <div className="floating-ui details-panel" data-testid="details-panel">
      <div className="details-header">
        <div>
          <h2>{neighborhood}</h2>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Chicago Community Area
          </span>
        </div>
        <button 
          className="details-close" 
          onClick={onClose}
          data-testid="details-close"
        >
          <X size={20} />
        </button>
      </div>

      <div className="details-content">
        {/* Time Awareness */}
        {crime_peak_hour && (
          <div className="details-section">
            <div className="details-section-title">When to Be Aware</div>
            <div className="detail-row">
              <span className="detail-label">Peak Hours</span>
              <span className="detail-value">{crime_peak_hour}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Busiest Day</span>
              <span className="detail-value">{crime_peak_day}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Busiest Month</span>
              <span className="detail-value">{crime_peak_month}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Night Incidents</span>
              <span className="detail-value">{formatPercent(crime_night_pct)}</span>
            </div>
          </div>
        )}

        {/* Crime Information */}
        <div className="details-section">
          <div className="details-section-title">Reported Incidents</div>
          <div className="detail-row">
            <span className="detail-label">Total (Annual)</span>
            <span className="detail-value">{formatNumber(crime_total_incidents)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Common Types</span>
            <span className="detail-value" style={{ fontSize: '12px' }}>
              {crime_top_types || 'N/A'}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Violent Incidents</span>
            <span className="detail-value">{formatPercent(crime_violent_pct)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Common Location</span>
            <span className="detail-value">{crime_top_location || 'N/A'}</span>
          </div>
        </div>

        {/* 311 Service Info */}
        <div className="details-section">
          <div className="details-section-title">311 Service Requests</div>
          <div className="detail-row">
            <span className="detail-label">Total Requests</span>
            <span className="detail-value">{formatNumber(requests_311_total)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Avg Resolution</span>
            <span className="detail-value">{formatHours(avg_resolution_hours)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Street Lighting Issues</span>
            <span className="detail-value">{formatNumber(street_light_complaints)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Vacant Buildings</span>
            <span className="detail-value">{formatNumber(vacant_building_complaints)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Top Complaint</span>
            <span className="detail-value" style={{ fontSize: '12px' }}>
              {most_common_complaint || 'N/A'}
            </span>
          </div>
        </div>

        {/* Community Discussion */}
        <div className="details-section">
          <div className="details-section-title">Community Discussion (Reddit)</div>
          <div className="detail-row">
            <span className="detail-label">Total Posts</span>
            <span className="detail-value">{formatNumber(reddit_total_posts)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Positive/Reassuring</span>
            <span className="detail-value">{formatNumber(reddit_positive_reassuring)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Neutral/Concerns</span>
            <span className="detail-value">{formatNumber(reddit_neutral_concern)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeighborhoodDetailsPanel;


