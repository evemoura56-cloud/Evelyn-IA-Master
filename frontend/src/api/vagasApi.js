import apiClient from './apiClient';

export const vagasApi = {
  getVagas: () => {
    return apiClient.get('?path=vagas');
  },
  createVaga: (vagaData) => {
    // O backend espera chaves em maiúsculo (TITULO_VAGA, etc.)
    const formattedData = {
      TITULO_VAGA: vagaData.titulo,
      EMPRESA: vagaData.empresa,
      LOCAL: vagaData.local,
      MODELO: vagaData.modelo,
      TIPO_CONTRATO: vagaData.tipoContrato,
      SENIORIDADE: vagaData.senioridade,
      LINK_VAGA: vagaData.link,
      FONTE: vagaData.fonte,
    };
    return apiClient.post('?path=vagas', formattedData);
  },
};
