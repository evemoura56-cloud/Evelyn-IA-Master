/**
 * @OnlyCurrentDoc
 *
 * Contém a lógica de negócio para operações relacionadas às Personas (GEMS).
 */

const GemService = {

  /**
   * Retorna uma lista de todas as GEMS que estão marcadas como ativas na planilha.
   */
  getActiveGems() {
    const allGems = SheetService.getSheetData("GEMS");
    const activeGems = allGems.filter(gem => gem.ATIVA === true);

    // Retorna apenas os campos relevantes para o frontend
    return activeGems.map(gem => ({
      id: gem.ID,
      name: gem.NOME,
      slug: gem.SLUG,
      description: gem.DESCRICAO,
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
    const gem = allGems.find(g => g.SLUG === slug && g.ATIVA === true);

    if (!gem) {
      Logger.log(`Persona com slug "${slug}" não encontrada ou inativa.`);
      return null;
    }

    return gem;
  }
};
