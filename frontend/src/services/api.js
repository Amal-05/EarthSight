import axios from 'axios';

// VITE_API_BASE_URL is set to the Render backend URL in production (e.g. https://earthsight.onrender.com/api)
// Falls back to /api for local dev (proxied by Vite) and Vercel serverless
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const checkBackendHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE}/health`);
    return response.data;
  } catch (error) {
    console.error('Backend health check error:', error);
    return null;
  }
};

export const runFullPipeline = async (bbox, year1, year2, mode = 'demo') => {
  const response = await axios.post(`${API_BASE}/analysis/full-pipeline`, {
    bbox,
    year1: parseInt(year1),
    year2: parseInt(year2),
    mode
  });
  return response.data;
};

export const executeSemanticQuery = async (queryText, year1 = 2018, year2 = 2025) => {
  const response = await axios.post(`${API_BASE}/semantic-query`, {
    query: queryText,
    year1: parseInt(year1),
    year2: parseInt(year2)
  });
  return response.data;
};

export const searchSatelliteScenes = async (bbox, startDate, endDate, mode = 'demo') => {
  const response = await axios.post(`${API_BASE}/satellite/search`, {
    bbox,
    start_date: startDate,
    end_date: endDate,
    mode
  });
  return response.data;
};
