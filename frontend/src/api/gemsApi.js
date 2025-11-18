import { localDatabase } from '../services/localDatabase';

export const gemsApi = {
  getGems: () => Promise.resolve({ data: localDatabase.getPersonas() }),
  createGem: (personaData) => Promise.resolve({ data: localDatabase.addPersona(personaData) }),
  reset: () => Promise.resolve({ data: localDatabase.reset() }),
  MAX_PERSONAS: localDatabase.MAX_PERSONAS
};
