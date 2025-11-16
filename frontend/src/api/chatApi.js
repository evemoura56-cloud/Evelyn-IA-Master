import apiClient from './apiClient';

export const chatApi = {
  sendMessage: (personaSlug, userMessage, conversationId = null) => {
    return apiClient.post('?path=chat', {
      personaSlug,
      userMessage,
      conversationId
    });
  },
};
