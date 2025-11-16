import apiClient from './apiClient';

export const candidaturasApi = {
  getCandidaturas: (vagaId = null) => {
    const params = vagaId ? `?path=candidaturas&vagaId=${vagaId}` : '?path=candidaturas';
    return apiClient.get(params);
  },
  createCandidatura: (candidaturaData) => {
    // Adapta o nome dos campos para o que o backend espera
    const formattedData = {
      ID_VAGA: candidaturaData.idVaga,
      STATUS_ATUAL: candidaturaData.status,
      CANAL_ENVIO: candidaturaData.canal,
      LINK_CANDIDATURA: candidaturaData.link,
    };
    return apiClient.post('?path=candidaturas', formattedData);
  },
};
