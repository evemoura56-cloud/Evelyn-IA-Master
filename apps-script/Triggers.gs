/**
 * @OnlyCurrentDoc
 *
 * Contém funções para criar e gerenciar gatilhos (triggers) programaticamente.
 * Por exemplo, para executar tarefas em segundo plano de tempos em tempos.
 */

const Triggers = {

  /**
   * Exemplo de função para criar um trigger que executa uma função a cada hora.
   * Não é usado atualmente, mas serve como um template.
   */
  createHourlyTrigger() {
    // Primeiro, deleta triggers antigos para evitar duplicação
    this.deleteTriggerByName('myHourlyFunction');

    // Cria um novo trigger
    ScriptApp.newTrigger('myHourlyFunction')
      .timeBased()
      .everyHours(1)
      .create();

    Logger.log("Trigger 'myHourlyFunction' criado para rodar a cada hora.");
  },

  /**
   * Função a ser executada pelo trigger.
   */
  myHourlyFunction() {
    // Exemplo: poderia ser uma função para buscar novas vagas automaticamente
    Logger.log("Trigger 'myHourlyFunction' executado.");
  },

  /**
   * Deleta todos os triggers associados a uma função específica.
   * @param {string} functionName - O nome da função cujo trigger será deletado.
   */
  deleteTriggerByName(functionName) {
    const allTriggers = ScriptApp.getProjectTriggers();
    for (const trigger of allTriggers) {
      if (trigger.getHandlerFunction() === functionName) {
        ScriptApp.deleteTrigger(trigger);
      }
    }
  }
};
