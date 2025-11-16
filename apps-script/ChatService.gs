/**
 * @OnlyCurrentDoc
 *
 * Orquestra a lógica do chat e do robô preenched-or.
 * Recebe a requisição, busca a persona e chama o LLMClient para gerar uma resposta.
 */

const ChatService = {

  /**
   * Lida com as requisições do endpoint de chat.
   * @param {object} body - O corpo da requisição POST.
   * @returns {object} - A resposta a ser enviada ao frontend.
   */
  handleChat(body) {
    const { personaSlug, userMessage, conversationId } = body;

    if (!personaSlug || !userMessage) {
      return { status: "error", message: "personaSlug e userMessage são obrigatórios." };
    }

    const persona = GemService.getGemBySlug(personaSlug);
    if (!persona) {
      return { status: "error", message: `Persona com slug "${personaSlug}" não encontrada.` };
    }

    const context = {
      systemPrompt: persona.SYSTEM_PROMPT,
      userMessage: userMessage,
      conversationId: conversationId,
    };

    // Chama a camada do LLM para obter uma resposta
    const response = LLMClient.generateResponse(persona, context);

    return {
      conversationId: conversationId || `conv_${new Date().getTime()}`,
      assistantMessage: response,
      personaSlug: personaSlug,
    };
  },

  /**
   * Lida com as requisições do endpoint do robô preenchedor.
   * @param {object} body - O corpo da requisição POST.
   * @returns {object} - A resposta com os textos gerados.
   */
  handlePreenchedor(body) {
    const { personaSlug, dadosVaga, perfilCandidata, tom } = body;

    if (!personaSlug || !dadosVaga || !perfilCandidata) {
      return { status: "error", message: "personaSlug, dadosVaga e perfilCandidata são obrigatórios." };
    }

    const persona = GemService.getGemBySlug(personaSlug);
    if (!persona) {
      return { status: "error", message: `Persona com slug "${personaSlug}" não encontrada.` };
    }

    const context = {
        systemPrompt: `${persona.SYSTEM_PROMPT}. Instruções adicionais: Você é um robô preenchedor de vagas. Seu objetivo é criar uma mensagem de candidatura concisa e humana, baseada nos dados da vaga e no perfil da candidata. Use um tom ${tom || 'profissional e direto'}.`,
        dadosVaga,
        perfilCandidata
    };

    // Chama a camada do LLM para gerar o texto (atualmente, um mock)
    const response = LLMClient.generateResponse(persona, context);

    // Estrutura de resposta mockada
    return {
        mensagemParaRecrutador: `Olá! Sou a Evelyn, e escrevo sobre a vaga. ${response}`,
        resumoPersonalizado: `Analisando a vaga, vejo que meu perfil com foco em ${perfilCandidata.substring(0, 50)}... se encaixa perfeitamente.`,
        bulletsMotivos: [
            "Fit com a cultura da empresa.",
            "Experiência relevante nos requisitos.",
            "Alta motivação para contribuir com o time."
        ]
    };
  }
};
