import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export class AgentService {
  static async generateUI(intent, parentId = null) {
    try {
      const response = await api.post('/agent/generate', {
        intent,
        parentId
      });
      return response.data;
    } catch (error) {
      console.error('Generate UI error:', error);
      throw error;
    }
  }

  static async modifyUI(intent, versionId) {
    try {
      const response = await api.post('/agent/modify', {
        intent,
        versionId
      });
      return response.data;
    } catch (error) {
      console.error('Modify UI error:', error);
      throw error;
    }
  }

  static async rollbackVersion(versionId) {
    try {
      const response = await api.post(`/versions/${versionId}/rollback`);
      return response.data;
    } catch (error) {
      console.error('Rollback error:', error);
      throw error;
    }
  }
}