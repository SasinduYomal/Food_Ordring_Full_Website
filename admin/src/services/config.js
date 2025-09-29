const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
// Derive asset base (strip trailing /api)
const ASSET_BASE_URL = API_BASE_URL.replace(/\/?api\/?$/, '');

const config = {
  API_BASE_URL,
  ASSET_BASE_URL,
};

export default config;
