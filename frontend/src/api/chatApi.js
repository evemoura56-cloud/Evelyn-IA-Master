import { localDatabase } from '../services/localDatabase';

export const chatApi = {
  sendMessage: (personaSlug, userMessage, conversationId = null) => Promise.resolve({
    data: localDatabase.sendChatMessage(personaSlug, userMessage, conversationId)
  })
};
