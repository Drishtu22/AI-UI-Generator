import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export class VersionStore {
  static async getVersions() {
    try {
      const response = await axios.get(`${API_BASE_URL}/versions`);
      return response.data.versions || [];
    } catch (error) {
      console.error('Failed to fetch versions:', error);
      return [];
    }
  }

  static async getVersion(id) {
    try {
      const response = await axios.get(`${API_BASE_URL}/versions/${id}`);
      return response.data.version;
    } catch (error) {
      console.error('Failed to fetch version:', error);
      return null;
    }
  }

  static async clearVersions() {
    try {
      await axios.delete(`${API_BASE_URL}/versions/clear`);
    } catch (error) {
      console.error('Failed to clear versions:', error);
    }
  }
}