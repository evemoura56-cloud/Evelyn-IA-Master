import { localDatabase } from '../services/localDatabase';

export const linksApi = {
  list: () => Promise.resolve({ data: localDatabase.getPrefilledLinks() }),
  regenerate: () => Promise.resolve({ data: localDatabase.regeneratePrefilledLinks().prefilledLinks })
};
