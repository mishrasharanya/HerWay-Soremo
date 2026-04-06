import React, { useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapController = ({ flyTo }) => {
  const map = useMap();
  
  useEffect(() => {
    if (flyTo) {
      map.flyTo(flyTo.center, flyTo.zoom || 12, { duration: 0.8 });
    }
  }, [flyTo, map]);
  
  return null;
};

const ChicagoMap = ({ 
  geoJsonData, 
  activeFilter,
  selectedNeighborhood,
  onNeighborhoodHover, 
  onNeighborhoodClick,
  flyToNeighborhood
}) => {
  const chicagoCenter = [41.8350, -87.6500];
  const defaultZoom = 10.5;
  
  const chicagoBounds = [
    [41.64, -87.94],
    [42.02, -87.52]
  ];

  // Get color based on risk level
  const getRiskColor = (riskLevel) => {
    if (!riskLevel) return '#5DD39E';
    const risk = riskLevel.toLowerCase();
    if (risk.includes('high')) return '#FF6B6B';
    if (risk.includes('medium')) return '#FFB347';
    return '#5DD39E';
  };

  // Calculate circle radius based on crime incidents
  const getRadius = (incidents) => {
    if (!incidents) return 8;
    const minRadius = 8;
    const maxRadius = 35;
    const maxIncidents = 15000;
    const normalized = Math.min(incidents / maxIncidents, 1);
    return minRadius + (normalized * (maxRadius - minRadius));
  };

  // Get center of polygon
  const getPolygonCenter = (geometry) => {
    if (!geometry) return null;
    
    let coords;
    if (geometry.type === 'MultiPolygon') {
      coords = geometry.coordinates[0][0];
    } else if (geometry.type === 'Polygon') {
      coords = geometry.coordinates[0];
    } else {
      return null;
    }
    
    const lats = coords.map(c => c[1]);
    const lngs = coords.map(c => c[0]);
    return [
      (Math.min(...lats) + Math.max(...lats)) / 2,
      (Math.min(...lngs) + Math.max(...lngs)) / 2
    ];
  };

  // Filter neighborhoods based on active filter
  const getFilteredFeatures = () => {
    if (!geoJsonData) return [];
    
    return geoJsonData.features.filter(feature => {
      const csvData = feature.properties.csvData;
      if (!csvData) return false;
      
      if (activeFilter === 'all') return true;
      
      const riskLevel = csvData.final_risk?.toLowerCase() || '';
      if (activeFilter === 'high') return riskLevel.includes('high');
      if (activeFilter === 'medium') return riskLevel.includes('medium');
      if (activeFilter === 'low') return riskLevel.includes('low');
      
      return true;
    });
  };

  const flyTo = flyToNeighborhood ? {
    center: flyToNeighborhood.center,
    zoom: 12
  } : null;

  return (
    <MapContainer
      center={chicagoCenter}
      zoom={defaultZoom}
      className="map-container"
      zoomControl={true}
      maxBounds={chicagoBounds}
      maxBoundsViscosity={0.9}
      minZoom={10}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      
      {getFilteredFeatures().map((feature, idx) => {
        const csvData = feature.properties.csvData;
        const center = getPolygonCenter(feature.geometry);
        
        if (!center || !csvData) return null;
        
        const color = getRiskColor(csvData.final_risk);
        const radius = getRadius(csvData.crime_total_incidents);
        const isSelected = selectedNeighborhood?.neighborhood === csvData.neighborhood;
        
        return (
          <CircleMarker
            key={csvData.neighborhood || idx}
            center={center}
            radius={radius}
            pathOptions={{
              fillColor: color,
              fillOpacity: isSelected ? 0.9 : 0.6,
              color: isSelected ? '#fff' : color,
              weight: isSelected ? 3 : 1,
              opacity: 0.8
            }}
            eventHandlers={{
              mouseover: (e) => {
                e.target.setStyle({ fillOpacity: 0.85, weight: 2 });
                onNeighborhoodHover(csvData, { 
                  x: e.originalEvent.pageX, 
                  y: e.originalEvent.pageY 
                });
              },
              mouseout: (e) => {
                e.target.setStyle({ 
                  fillOpacity: isSelected ? 0.9 : 0.6, 
                  weight: isSelected ? 3 : 1 
                });
                onNeighborhoodHover(null, null);
              },
              click: () => {
                onNeighborhoodClick(csvData);
              }
            }}
          />
        );
      })}
      
      <MapController flyTo={flyTo} />
    </MapContainer>
  );
};

export default ChicagoMap;