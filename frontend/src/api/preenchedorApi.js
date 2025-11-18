import { localDatabase } from '../services/localDatabase';

export const preenchedorApi = {
  gerarTexto: (data) => Promise.resolve({ data: localDatabase.gerarTextoPreenchedor(data) })
};
