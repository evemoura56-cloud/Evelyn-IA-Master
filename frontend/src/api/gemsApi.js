import apiClient from './apiClient';

export const gemsApi = {
  getGems: () => {
    return apiClient.get('?path=gems');
  },
};
