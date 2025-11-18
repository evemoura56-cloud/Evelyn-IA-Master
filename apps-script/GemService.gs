/**
 * @OnlyCurrentDoc
 *
 * Contém a lógica de negócio para operações relacionadas às Personas (GEMS).
 */

const GemService = {

  /**
   * Determina se uma GEM está ativa.
   * A coluna ATIVA nem sempre está presente ou pode conter diferentes representações.
   */
  isGemActive(gem) {
    if (gem.ATIVA === undefined || gem.ATIVA === "") {
      return true; // Se a coluna não existir ou estiver vazia, consideramos ativa
    }

    if (typeof gem.ATIVA === "boolean") {
      return gem.ATIVA;
    }

    const normalized = String(gem.ATIVA).toLowerCase();
    return normalized === "true" || normalized === "1" || normalized === "sim";
  },

  /**
   * Retorna uma lista de todas as GEMS que estão marcadas como ativas na planilha.
   */
  getActiveGems() {
    const allGems = SheetService.getSheetData("GEMS");
    const activeGems = allGems.filter(gem => this.isGemActive(gem));

    // Retorna apenas os campos relevantes para o frontend
    return activeGems.map(gem => ({
      id: gem.ID,
      nome: gem.NOME,
      slug: gem.SLUG,
      descricao: gem.DESCRICAO,
      systemPrompt: gem.SYSTEM_PROMPT,
      tone: gem.TONE,
      tags: gem.TAGS,
      scope: gem.SCOPE
    }));
  },

  /**
   * Busca uma persona específica pelo seu slug.
   * @param {string} slug - O slug da persona a ser encontrada.
   * @returns {object|null} - O objeto da persona ou null se não for encontrada.
   */
  getGemBySlug(slug) {
    const allGems = SheetService.getSheetData("GEMS");
    const gem = allGems.find(g => g.SLUG === slug && this.isGemActive(g));

    if (!gem) {
      Logger.log(`Persona com slug "${slug}" não encontrada ou inativa.`);
      return null;
    }

    return gem;
  }
};
