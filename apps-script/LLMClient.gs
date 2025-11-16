/**
 * @OnlyCurrentDoc
 *
 * Camada de abstração para comunicação com o modelo de linguagem (LLM).
 * Atualmente funciona como um "stub", retornando respostas mockadas.
 * Projetado para ser facilmente integrado com a API do Gemini no futuro.
 */

const LLMClient = {

  /**
   * Lê as configurações da API da aba 'CONFIG'.
   * @returns {object} - Um objeto com as configurações.
   */
  getConfig() {
    const configData = SheetService.getSheetData("CONFIG");
    const config = configData.reduce((acc, row) => {
      acc[row.CHAVE] = row.VALOR;
      return acc;
    }, {});
    return config;
  },

  /**
   * Gera uma resposta com base na persona e no contexto.
   * ATUALMENTE, RETORNA UM MOCK.
   * @param {object} persona - O objeto da persona (GEM).
   * @param {object} context - O contexto da conversa/requisição.
   * @returns {string} - A resposta gerada.
   */
  generateResponse(persona, context) {
    // Resposta Mockada (Stub)
    const mockResponse = `Olá! Eu sou ${persona.NOME}. Recebi sua mensagem: "${context.userMessage || 'dados do preenchedor'}". No momento, estou em modo de simulação, mas estou pronta para ser conectada a uma IA real!`;

    Logger.log(`Gerando resposta mockada para a persona ${persona.NOME}.`);
    return mockResponse;

    // --- CÓDIGO DE INTEGRAÇÃO REAL COM GEMINI (PARA O FUTURO) ---
    /*

    // 1. Descomente o bloco de código abaixo.
    // 2. Comente ou remova a resposta mockada acima.
    // 3. Certifique-se de que a GEMINI_API_KEY está preenchida na aba CONFIG da planilha.

    try {
      const config = this.getConfig();
      const apiKey = config.GEMINI_API_KEY;
      const model = config.BASE_MODEL || "gemini-1.5-flash";

      if (!apiKey) {
        throw new Error("API Key do Gemini não encontrada na aba CONFIG.");
      }

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const payload = {
        "contents": [{
          "parts": [
            { "text": persona.SYSTEM_PROMPT },
            { "text": `\n\nContexto adicional: ${JSON.stringify(context)}` }
          ]
        }]
      };

      const options = {
        'method': 'post',
        'contentType': 'application/json',
        'payload': JSON.stringify(payload)
      };

      const response = UrlFetchApp.fetch(apiUrl, options);
      const data = JSON.parse(response.getContentText());

      // Extrai a resposta do candidato
      const assistantMessage = data.candidates[0].content.parts[0].text;

      return assistantMessage.trim();

    } catch (e) {
      Logger.log(`Erro ao chamar a API do Gemini: ${e.toString()}`);
      return `Ocorreu um erro ao tentar me comunicar com a IA. Detalhes: ${e.message}`;
    }

    */
  }
};
