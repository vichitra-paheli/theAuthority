import axios from 'axios';
import type { GameState, Email, DemographicResponse, ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API methods
export const gameApi = {
  // Health check
  async healthCheck() {
    const response = await apiClient.get('/game/health');
    return response.data;
  },

  // Game management
  async createGame(playerName: string, saveName: string) {
    const response = await apiClient.post('/game/create', {
      playerName,
      saveName,
    });
    return response.data;
  },

  async loadGame(playerName: string, saveName: string) {
    const response = await apiClient.get(`/game/load/${playerName}/${saveName}`);
    return response.data;
  },

  async getPlayerSaves(playerName: string) {
    const response = await apiClient.get(`/game/saves/${playerName}`);
    return response.data;
  },

  // LLM testing
  async testLLM(demographic: string, policy: string) {
    const response = await apiClient.post('/game/test-llm', {
      demographic,
      policy,
    });
    return response.data;
  },

  // Policy submission (to be implemented)
  async submitPolicy(playerName: string, saveName: string, title: string, description: string) {
    const response = await apiClient.post('/game/submit-policy', {
      playerName,
      saveName,
      title,
      description,
    });
    return response.data;
  },

  // Get emails (to be implemented)
  async getEmails(playerName: string, saveName: string) {
    const response = await apiClient.get(`/game/emails/${playerName}/${saveName}`);
    return response.data;
  },
};

export default apiClient;
