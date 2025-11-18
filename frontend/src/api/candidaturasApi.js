import { localDatabase } from '../services/localDatabase';

export const candidaturasApi = {
  getCandidaturas: () => Promise.resolve({ data: localDatabase.getCandidaturas() }),
  createCandidatura: (data) => Promise.resolve({ data: localDatabase.createCandidatura(data) })
};
