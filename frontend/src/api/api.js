import axios from 'axios';

// A URL base da API é injetada pelo Vite durante o processo de build
// a partir do arquivo .env.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Cria uma instância do axios com a URL base pré-configurada.
// Isso evita ter que repetir a URL em todas as chamadas.
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'text/plain;charset=utf-8', // Apps Script Web Apps requerem este header
  },
});

/**
 * Busca a lista de personas (GEMS) ativas.
 * Corresponde ao endpoint GET /gems.
 * @returns {Promise<Array>} Uma promessa que resolve para a lista de personas.
 */
export const getGems = async () => {
  try {
    // O Apps Script usa um parâmetro 'path' para roteamento
    const response = await apiClient.get(`?path=gems`);
    // O Apps Script às vezes retorna JSON dentro de uma string, então garantimos o parse.
    return typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
  } catch (error) {
    console.error('Erro ao buscar as GEMS:', error);
    throw error;
  }
};

/**
 * Envia uma mensagem para o chat e recebe a resposta da IA.
 * Corresponde ao endpoint POST /chat.
 * @param {object} chatData - Os dados da mensagem.
 * @param {string} chatData.personaSlug - O slug da persona selecionada.
 * @param {string} chatData.userMessage - A mensagem do usuário.
 * @param {string|null} chatData.conversationId - O ID da conversa atual.
 * @returns {Promise<object>} Uma promessa que resolve para a resposta da IA.
 */
export const postChatMessage = async (chatData) => {
  try {
    const response = await apiClient.post(`?path=chat`, chatData);
    return typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
  } catch (error) {
    console.error('Erro ao enviar mensagem para o chat:', error);
    throw error;
  }
};
