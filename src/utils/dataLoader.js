import Papa from 'papaparse';

export const normalizeNeighborhoodName = (name) => {
  if (!name) return '';
  return name
    .toUpperCase()
    .trim()
    .replace(/['']/g, "'")
    .replace(/\s+/g, ' ');
};

export const loadCSVData = async (csvUrl) => {
  try {
    const response = await fetch(csvUrl);
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          const dataMap = {};
          results.data.forEach(row => {
            if (row.neighborhood) {
              const normalizedName = normalizeNeighborhoodName(row.neighborhood);
              dataMap[normalizedName] = {
                ...row,
                normalizedName
              };
            }
          });
          resolve({ data: results.data, dataMap });
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error loading CSV:', error);
    throw error;
  }
};

export const loadGeoJSON = async (geoJsonUrl) => {
  try {
    const response = await fetch(geoJsonUrl);
    const geoJson = await response.json();
    return geoJson;
  } catch (error) {
    console.error('Error loading GeoJSON:', error);
    throw error;
  }
};

export const mergeDataWithGeoJSON = (geoJson, csvDataMap) => {
  const mergedFeatures = geoJson.features.map(feature => {
    const geoName = normalizeNeighborhoodName(feature.properties.community);
    const csvData = csvDataMap[geoName];
    
    return {
      ...feature,
      properties: {
        ...feature.properties,
        csvData: csvData || null,
        hasData: !!csvData
      }
    };
  });

  return {
    ...geoJson,
    features: mergedFeatures
  };
};

export const getRiskColor = (riskLevel) => {
  if (!riskLevel) return '#CCCCCC';
  
  const risk = riskLevel.toLowerCase();
  if (risk.includes('high')) return '#E63946';
  if (risk.includes('medium')) return '#F4A261';
  if (risk.includes('low')) return '#2A9D8F';
  return '#CCCCCC';
};

export const getRiskClass = (riskLevel) => {
  if (!riskLevel) return '';
  
  const risk = riskLevel.toLowerCase();
  if (risk.includes('high')) return 'high';
  if (risk.includes('medium')) return 'medium';
  if (risk.includes('low')) return 'low';
  return '';
};

export const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return 'N/A';
  return Number(num).toLocaleString();
};

export const formatPercent = (num) => {
  if (num === null || num === undefined || isNaN(num)) return 'N/A';
  return `${Number(num).toFixed(1)}%`;
};

export const formatHours = (num) => {
  if (num === null || num === undefined || isNaN(num)) return 'N/A';
  return `${Number(num).toFixed(1)} hrs`;
};

export const formatScore = (num) => {
  if (num === null || num === undefined || isNaN(num)) return 'N/A';
  return Number(num).toFixed(3);
};