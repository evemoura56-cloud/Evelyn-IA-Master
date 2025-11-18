import { localDatabase } from '../services/localDatabase';
import { jobsFeedService } from '../services/jobsFeedService';

export const vagasApi = {
  getVagas: () => Promise.resolve({ data: localDatabase.getVagas() }),
  createVaga: (vagaData) => Promise.resolve({ data: localDatabase.createVaga(vagaData) }),
  fetchRealVagas: (search) => jobsFeedService.fetchRecentJobs({ search })
};
