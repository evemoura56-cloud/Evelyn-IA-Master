/**
 * @OnlyCurrentDoc
 *
 * Funções auxiliares e utilitários que podem ser usados em todo o projeto.
 */

const Utils = {
  /**
   * Exemplo de função utilitária.
   * Gera um ID único simples.
   * @param {string} prefix - O prefixo para o ID.
   * @returns {string} - O ID gerado.
   */
  generateUniqueId(prefix = 'id') {
    return `${prefix}_${new Date().getTime()}_${Math.random().toString(36).substr(2, 9)}`;
  }
};
