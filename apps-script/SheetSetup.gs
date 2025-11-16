/**
 * @OnlyCurrentDoc
 *
 * Responsável pela criação e configuração inicial da planilha.
 * Cria todas as abas, formatações, validações de dados e gráficos.
 */

const SPREADSHEET_NAME = "Evelyn GEMS Hub – Painel Central";

const SheetSetup = {
  initProject() {
    try {
      let ss = this.findSpreadsheetByName(SPREADSHEET_NAME);
      if (!ss) {
        ss = SpreadsheetApp.create(SPREADSHEET_NAME);
        Logger.log(`Planilha "${SPREADSHEET_NAME}" criada com ID: ${ss.getId()}`);
        this.setupAllSheets(ss);
        return { status: "success", message: "Planilha criada e configurada com sucesso!", spreadsheetId: ss.getId(), url: ss.getUrl() };
      } else {
        Logger.log(`Planilha "${SPREADSHEET_NAME}" já existe.`);
        // Opcional: Adicionar verificação para garantir que todas as abas existem.
        return { status: "success", message: "Planilha já existente encontrada.", spreadsheetId: ss.getId(), url: ss.getUrl() };
      }
    } catch (e) {
      Logger.log(e);
      return { status: "error", message: `Erro ao inicializar o projeto: ${e.message}` };
    }
  },

  findSpreadsheetByName(name) {
    const files = DriveApp.getFilesByName(name);
    if (files.hasNext()) {
      const file = files.next();
      return SpreadsheetApp.openById(file.getId());
    }
    return null;
  },

  setupAllSheets(ss) {
    // Renomear a primeira aba padrão antes de criar as outras
    ss.getSheets()[0].setName("DASHBOARD");

    this.setupConfigSheet(ss);
    this.setupGemsSheet(ss);
    this.setupVagasSheet(ss);
    this.setupCandidaturasSheet(ss);
    this.setupDashboardSheet(ss); // Configura o dashboard por último
  },

  applyHeaderStyle(sheet, color) {
    const header = sheet.getRange("A1:Z1");
    header.setBackground(color).setFontColor("white").setFontWeight("bold");
    sheet.setFrozenRows(1);
  },

  // ... (funções de setup para cada aba)

  setupConfigSheet(ss) {
    const sheet = ss.insertSheet("CONFIG");
    this.applyHeaderStyle(sheet, "#434343"); // Cinza escuro
    sheet.getRange("A1:B1").setValues([["CHAVE", "VALOR"]]);
    const configData = [
      ["API_PROVIDER", "GEMINI"],
      ["GEMINI_API_KEY", ""],
      ["BASE_MODEL", "gemini-1.5-flash"],
      ["FRONTEND_URL", ""]
    ];
    sheet.getRange("A2:B5").setValues(configData);
    sheet.getRange("A:A").setFontWeight("bold");
  },

  setupGemsSheet(ss) {
    const sheet = ss.insertSheet("GEMS");
    this.applyHeaderStyle(sheet, "#4a148c"); // Roxo escuro
    const headers = [["ID", "NOME", "SLUG", "DESCRICAO", "SYSTEM_PROMPT", "TONE", "TAGS", "ATIVA", "SCOPE"]];
    sheet.getRange("A1:I1").setValues(headers);

    const sampleGems = [
      ["GEM001", "Evelyn PRO – Carreira e Vagas", "evelyn_pro_vagas", "Especialista em carreira, vagas e otimização de perfil profissional.", "Você é Evelyn PRO, uma especialista em carreira. Sua missão é ajudar usuários a encontrar vagas, melhorar currículos e se preparar para entrevistas.", "Profissional, Direto", "carreira,vagas,linkedin", true, "carreira"],
      ["GEM002", "Evelyn PRO – Arquiteta da Realidade", "evelyn_pro_arquitetura", "Focada em planejamento estratégico e arquitetura de vida.", "Você é uma arquiteta de realidade, ajudando a estruturar metas e planos de vida.", "Estratégico, Inspirador", "planejamento,vida,metas", true, "vida"],
      ["GEM003", "Rota Hunter – Parcerias", "rota_hunter", "Especialista em logística e prospecção de parcerias.", "Você é Rota Hunter, um especialista em logística. Seu objetivo é encontrar as melhores rotas e parceiros.", "Analítico, Objetivo", "logistica,parcerias", false, "logistica"],
      ["GEM004", "Codex DEV – Engenheira Senior", "codex_dev", "Engenheira de software sênior para resolver problemas de código.", "Você é Codex DEV. Responda a perguntas de programação com código claro, eficiente e bem explicado.", "Técnico, Preciso", "codigo,dev,javascript", true, "codigo"],
      ["GEM005", "Tarot & Intuição", "tarot_intuicao", "Guia para autoconhecimento através do tarot e da intuição.", "Você oferece leituras de tarot e insights intuitivos para autoconhecimento.", "Intuitivo, Calmo", "tarot,autoconhecimento", true, "tarot"],
      ["GEM006", "Planner da Rotina", "planner_rotina", "Assistente para organização de tarefas e otimização da rotina diária.", "Você ajuda a organizar a rotina, criar listas de tarefas e gerenciar o tempo.", "Organizado, Prático", "produtividade,rotina", true, "vida"],
      ["GEM007", "Mentora Tech", "mentora_tech", "Mentora para guiar iniciantes na carreira de tecnologia.", "Você é uma mentora de tecnologia. Dê conselhos de carreira, explique conceitos complexos de forma simples e motive.", "Didático, Paciente", "carreira,tecnologia,mentoria", true, "carreira"]
    ];
    sheet.getRange("A2:I8").setValues(sampleGems);
    const rule = SpreadsheetApp.newDataValidation().requireCheckbox().build();
    sheet.getRange("H2:H").setDataValidation(rule);
    sheet.autoResizeColumns(1, 9);
  },

  setupVagasSheet(ss) {
    const sheet = ss.insertSheet("VAGAS");
    this.applyHeaderStyle(sheet, "#3a2469"); // Roxo/Azul
    const headers = [["ID", "DATA_CADASTRO", "FONTE", "PLATAFORMA", "LINK_VAGA", "TITULO_VAGA", "EMPRESA", "LOCAL", "MODELO", "TIPO_CONTRATO", "SENIORIDADE", "SALARIO_FAIXA", "STATUS", "TAGS", "OBSERVACOES"]];
    sheet.getRange("A1:O1").setValues(headers);

    // Validações
    const modeloRule = SpreadsheetApp.newDataValidation().requireValueInList(["Home office", "Híbrido", "Presencial"], true).build();
    const contratoRule = SpreadsheetApp.newDataValidation().requireValueInList(["CLT", "PJ", "Estágio", "Freelancer"], true).build();
    const senioridadeRule = SpreadsheetApp.newDataValidation().requireValueInList(["Trainee", "Júnior", "Pleno", "Sênior", "Especialista"], true).build();
    const statusRule = SpreadsheetApp.newDataValidation().requireValueInList(["Cadastrada", "Candidatado", "Entrevista", "Rejeitado", "Aprovado"], true).build();

    sheet.getRange("I2:I").setDataValidation(modeloRule);
    sheet.getRange("J2:J").setDataValidation(contratoRule);
    sheet.getRange("K2:K").setDataValidation(senioridadeRule);
    sheet.getRange("M2:M").setDataValidation(statusRule);

    // Formatação Condicional
    const range = sheet.getRange("A2:O");
    const rules = [
      SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Candidatado").setBackground("#d9eaff").setRanges([range]).build(), // azul claro
      SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Entrevista").setBackground("#fff2cc").setRanges([range]).build(), // amarelo
      SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Aprovado").setBackground("#d9ead3").setRanges([range]).build(), // verde
      SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Rejeitado").setBackground("#f4cccc").setRanges([range]).build()  // vermelho claro
    ];
    const sheetRules = sheet.getConditionalFormatRules();
    rules.forEach(rule => sheetRules.push(rule));
    sheet.setConditionalFormatRules(sheetRules);

    sheet.autoResizeColumns(1, 15);
  },

  setupCandidaturasSheet(ss) {
    const sheet = ss.insertSheet("CANDIDATURAS");
    this.applyHeaderStyle(sheet, "#434343");
    const headers = [["ID_CANDIDATURA", "ID_VAGA", "DATA_CANDIDATURA", "STATUS_ATUAL", "CANAL_ENVIO", "LINK_CANDIDATURA", "CONTATO_RECRUTADOR", "MENSAGEM_ENVIADA", "RESPOSTAS_PERSONALIZADAS", "PROXIMO_PASSO"]];
    sheet.getRange("A1:J1").setValues(headers);

    // Reusa a validação e formatação de status da aba VAGAS
    const statusRule = SpreadsheetApp.newDataValidation().requireValueInList(["Cadastrada", "Candidatado", "Entrevista", "Rejeitado", "Aprovado"], true).build();
    sheet.getRange("D2:D").setDataValidation(statusRule);

    const range = sheet.getRange("A2:J");
    const rules = [
      SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Candidatado").setBackground("#d9eaff").setRanges([range]).build(),
      SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Entrevista").setBackground("#fff2cc").setRanges([range]).build(),
      SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Aprovado").setBackground("#d9ead3").setRanges([range]).build(),
      SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Rejeitado").setBackground("#f4cccc").setRanges([range]).build()
    ];
    const sheetRules = sheet.getConditionalFormatRules();
    rules.forEach(rule => sheetRules.push(rule));
    sheet.setConditionalFormatRules(sheetRules);

    sheet.autoResizeColumns(1, 10);
  },

  setupDashboardSheet(ss) {
    const sheet = ss.getSheetByName("DASHBOARD");

    // Totalizadores
    sheet.getRange("A1").setValue("Total de Vagas").setFontWeight("bold");
    sheet.getRange("B1").setFormula('=COUNTA(VAGAS!A2:A)');

    sheet.getRange("A2").setValue("Total de Candidaturas").setFontWeight("bold");
    sheet.getRange("B2").setFormula('=COUNTA(CANDIDATURAS!A2:A)');

    // Contagem por Status
    sheet.getRange("D1").setValue("Status das Candidaturas").setFontWeight("bold");
    sheet.getRange("D2").setValue("Candidatado");
    sheet.getRange("E2").setFormula('=COUNTIF(CANDIDATURAS!D2:D, D2)');
    sheet.getRange("D3").setValue("Entrevista");
    sheet.getRange("E3").setFormula('=COUNTIF(CANDIDATURAS!D2:D, D3)');
    sheet.getRange("D4").setValue("Aprovado");
    sheet.getRange("E4").setFormula('=COUNTIF(CANDIDATURAS!D2:D, D4)');
    sheet.getRange("D5").setValue("Rejeitado");
    sheet.getRange("E5").setFormula('=COUNTIF(CANDIDATURAS!D2:D, D5)');

    // Gráfico de Pizza por Status
    const chartBuilder = sheet.newChart()
      .setChartType(Charts.ChartType.PIE)
      .addRange(sheet.getRange("D1:E5"))
      .setPosition(2, 7, 0, 0)
      .setOption("title", "Candidaturas por Status")
      .build();
    sheet.insertChart(chartBuilder);
  }
};
