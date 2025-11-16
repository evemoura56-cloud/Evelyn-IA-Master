/**
 * @OnlyCurrentDoc
 *
 * Contém a lógica de negócio para operações relacionadas a Vagas.
 */

const JobService = {

  /**
   * Retorna uma lista de todas as vagas cadastradas.
   */
  getVagas() {
    return SheetService.getSheetData("VAGAS");
  },

  /**
   * Cria uma nova vaga na planilha.
   * @param {object} vagaData - Os dados da vaga a serem inseridos.
   * @returns {object} - A vaga que foi criada.
   */
  createVaga(vagaData) {
    if (!vagaData.TITULO_VAGA || !vagaData.EMPRESA) {
      throw new Error("Título da vaga e empresa são obrigatórios.");
    }

    const newVaga = {
      ID: `V${new Date().getTime()}`,
      DATA_CADASTRO: new Date().toLocaleDateString("pt-BR"),
      FONTE: vagaData.FONTE || "",
      PLATAFORMA: vagaData.PLATAFORMA || "",
      LINK_VAGA: vagaData.LINK_VAGA || "",
      TITULO_VAGA: vagaData.TITULO_VAGA,
      EMPRESA: vagaData.EMPRESA,
      LOCAL: vagaData.LOCAL || "",
      MODELO: vagaData.MODELO || "Home office",
      TIPO_CONTRATO: vagaData.TIPO_CONTRATO || "CLT",
      SENIORIDADE: vagaData.SENIORIDADE || "Pleno",
      SALARIO_FAIXA: vagaData.SALARIO_FAIXA || "",
      STATUS: "Cadastrada", // Status inicial padrão
      TAGS: vagaData.TAGS || "",
      OBSERVACOES: vagaData.OBSERVACOES || ""
    };

    return SheetService.appendRow("VAGAS", newVaga);
  }
};
