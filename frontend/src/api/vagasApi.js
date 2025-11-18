import { localDatabase } from '../services/localDatabase';

export const vagasApi = {
  getVagas: () => Promise.resolve({ data: localDatabase.getVagas() }),
  createVaga: (vagaData) => Promise.resolve({ data: localDatabase.createVaga(vagaData) })
};
