/**
 * @OnlyCurrentDoc
 *
 * Contém a lógica de negócio para operações relacionadas a Candidaturas.
 */

const ApplicationService = {

  /**
   * Retorna candidaturas. Pode filtrar por ID_VAGA se fornecido na query string.
   * @param {object} e - O objeto de evento do doGet.
   */
  getCandidaturas(e) {
    const vagaId = e.parameter.vagaId;
    const allCandidaturas = SheetService.getSheetData("CANDIDATURAS");

    if (vagaId) {
      return allCandidaturas.filter(c => c.ID_VAGA == vagaId);
    }

    return allCandidaturas;
  },

  /**
   * Cria uma nova candidatura e, opcionalmente, atualiza o status da vaga.
   * @param {object} candidaturaData - Os dados da candidatura.
   * @returns {object} - A candidatura criada.
   */
  createCandidatura(candidaturaData) {
    if (!candidaturaData.ID_VAGA) {
      throw new Error("O ID da Vaga (ID_VAGA) é obrigatório.");
    }

    const newCandidatura = {
      ID_CANDIDATURA: `C${new Date().getTime()}`,
      ID_VAGA: candidaturaData.ID_VAGA,
      DATA_CANDIDATURA: new Date().toLocaleDateString("pt-BR"),
      STATUS_ATUAL: candidaturaData.STATUS_ATUAL || "Candidatado",
      CANAL_ENVIO: candidaturaData.CANAL_ENVIO || "",
      LINK_CANDIDATURA: candidaturaData.LINK_CANDIDATURA || "",
      CONTATO_RECRUTADOR: candidaturaData.CONTATO_RECRUTADOR || "",
      MENSAGEM_ENVIADA: candidaturaData.MENSAGEM_ENVIADA || "",
      RESPOSTAS_PERSONALIZADAS: candidaturaData.RESPOSTAS_PERSONALIZADAS || "",
      PROXIMO_PASSO: candidaturaData.PROXIMO_PASSO || ""
    };

    // Atualiza o status da vaga correspondente, se um novo status for fornecido
    if (candidaturaData.STATUS_ATUAL) {
      const vagaRow = SheetService.findRow("VAGAS", "ID", candidaturaData.ID_VAGA);
      if (vagaRow) {
        SheetService.updateRow("VAGAS", vagaRow.rowIndex, { STATUS: candidaturaData.STATUS_ATUAL });
      } else {
        Logger.log(`Vaga com ID ${candidaturaData.ID_VAGA} não encontrada para atualização de status.`);
      }
    }

    return SheetService.appendRow("CANDIDATURAS", newCandidatura);
  }
};
