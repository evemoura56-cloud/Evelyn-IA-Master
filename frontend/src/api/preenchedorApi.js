import apiClient from './apiClient';

export const preenchedorApi = {
  gerarTexto: (data) => {
    const { personaSlug, dadosVaga, perfilCandidata, tom } = data;
    return apiClient.post('?path=preenchedor', {
      personaSlug,
      dadosVaga,
      perfilCandidata,
      tom,
    });
  },
};
