import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import ChicagoMap from './components/ChicagoMap';
import Controls from './components/Controls';
import Legend from './components/Legend';
import NeighborhoodTooltip from './components/NeighborhoodTooltip';
import NeighborhoodDetailsPanel from './components/NeighborhoodDetailsPanel';
import ChatbotPanel from './components/ChatbotPanel';
import { 
  loadCSVData, 
  loadGeoJSON, 
  mergeDataWithGeoJSON,
  normalizeNeighborhoodName 
} from './utils/dataLoader';

function App() {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [hoveredNeighborhood, setHoveredNeighborhood] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState(null);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(null);
  const [flyToNeighborhood, setFlyToNeighborhood] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [csvResult, geoJson] = await Promise.all([
          loadCSVData('/data/herway_final.csv'),
          loadGeoJSON('/data/chicago_neighborhoods.geojson')
        ]);
        const mergedGeoJson = mergeDataWithGeoJSON(geoJson, csvResult.dataMap);
        setGeoJsonData(mergedGeoJson);
        setNeighborhoods(csvResult.data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load neighborhood data');
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleNeighborhoodHover = useCallback((data, position) => {
    setHoveredNeighborhood(data);
    setTooltipPosition(position);
  }, []);

  const handleNeighborhoodClick = useCallback((data, layer) => {
    setSelectedNeighborhood(data);
  }, []);

  const handleSearchSelect = useCallback((neighborhood) => {
    setSelectedNeighborhood(neighborhood);
    if (geoJsonData) {
      const normalizedSearch = normalizeNeighborhoodName(neighborhood.neighborhood);
      const feature = geoJsonData.features.find(f => 
        normalizeNeighborhoodName(f.properties.community) === normalizedSearch
      );
      if (feature && feature.geometry) {
        const coords = feature.geometry.type === 'MultiPolygon' 
          ? feature.geometry.coordinates[0][0]
          : feature.geometry.coordinates[0];
        const lats = coords.map(c => c[1]);
        const lngs = coords.map(c => c[0]);
        const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
        const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
        setFlyToNeighborhood({ center: [centerLat, centerLng], zoom: 13 });
        setTimeout(() => setFlyToNeighborhood(null), 1000);
      }
    }
  }, [geoJsonData]);

  const handleCloseDetails = useCallback(() => {
    setSelectedNeighborhood(null);
  }, []);

  const handleFilterChange = useCallback((filter) => {
    setActiveFilter(filter);
  }, []);

  if (loading) {
    return (
      <div className="app-container" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontFamily: 'var(--font-main)'
      }}>
        <div style={{ textAlign: 'center', color: 'var(--text-primary)' }}>
          <h2>Loading HerWay...</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Preparing Chicago neighborhood data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontFamily: 'var(--font-main)'
      }}>
        <div style={{ textAlign: 'center', color: 'var(--risk-high)' }}>
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="app-container">
        <div className="map-section">
          <ChicagoMap
            geoJsonData={geoJsonData}
            activeFilter={activeFilter}
            selectedNeighborhood={selectedNeighborhood}
            onNeighborhoodHover={handleNeighborhoodHover}
            onNeighborhoodClick={handleNeighborhoodClick}
            flyToNeighborhood={flyToNeighborhood}
          />
          <Controls
            neighborhoods={neighborhoods}
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            onSearchSelect={handleSearchSelect}
          />
          <Legend />
          {hoveredNeighborhood && tooltipPosition && (
            <NeighborhoodTooltip
              data={hoveredNeighborhood}
              position={tooltipPosition}
            />
          )}
          {selectedNeighborhood && (
            <NeighborhoodDetailsPanel
              data={selectedNeighborhood}
              onClose={handleCloseDetails}
            />
          )}
        </div>
      </div>
      
      <ChatbotPanel selectedNeighborhood={selectedNeighborhood} />
    </>
  );
}

export default App;

