import axios from 'axios';

// Single place where the API base URL is configured.
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const client = axios.create({
  baseURL,
  timeout: 45000, // free hosting tiers can take a while to wake up
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default client;
