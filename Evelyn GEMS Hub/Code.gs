/**
 * @OnlyCurrentDoc
 */

function onOpen() {
  SpreadsheetApp.getUi()
      .createMenu('✨ GEMS Hub')
      .addItem('Iniciar', 'showSidebar')
      .addSeparator()
      .addItem('Atualizar Dashboard', 'createDashboard')
      .addToUi();
}

function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle('Evelyn GEMS Hub')
      .setWidth(300);
  SpreadsheetApp.getUi().showSidebar(html);
}

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = {
    "CONFIG": ["CHAVE", "VALOR"],
    "GEMS": ["ID_GEM", "NOME_GEM", "DESCRICAO", "TAGS"],
    "VAGAS": ["ID_VAGA", "TITULO_VAGA", "EMPRESA", "SENIORIDADE", "LINK_VAGA", "TAGS_TECNICAS", "CONTATO_RECRUTADOR", "EMAIL_RECRUTADOR", "STATUS"],
    "CANDIDATURAS": ["ID_CANDIDATURA", "ID_VAGA", "ID_GEM", "DATA_APLICACAO", "STATUS_CANDIDATURA"],
    "EMAILS": ["ID_VAGA", "EMPRESA", "CONTATO", "EMAIL", "MENSAGEM", "GMAIL", "COPIAR"],
    "DASHBOARD": []
  };

  for (const sheetName in sheets) {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }

    // Clear existing content and formatting
    sheet.clear();

    // Set headers if they exist
    if (sheets[sheetName].length > 0) {
      sheet.getRange(1, 1, 1, sheets[sheetName].length).setValues([sheets[sheetName]]).setFontWeight("bold");
    }

    // Apply modern formatting
    sheet.setTabColor("#1F2937"); // Dark gray
    sheet.getRange("A1:Z1000").setFontFamily("Inter").setFontSize(10).setVerticalAlignment("middle");
    sheet.getRange("A1:Z1").setBackground("#374151").setFontColor("#F9FAFB"); // Header background and font color

    // Auto-resize columns
    for (let i = 1; i <= sheets[sheetName].length; i++) {
      sheet.autoResizeColumn(i);
    }
  }

  // Specific setup for DASHBOARD
  const dashboardSheet = ss.getSheetByName("DASHBOARD");
  if (dashboardSheet) {
    dashboardSheet.clear();
    // Further dashboard setup will be handled by Dashboard.gs
  }

  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert('Setup completo! O Evelyn GEMS Hub está pronto para usar.');
}

function addGem(name, desc, tags) {
  if (!name || !desc || !tags) {
    throw new Error("Todos os campos de GEMS são obrigatórios.");
  }
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("GEMS");
  const newId = getNewId(sheet);
  sheet.appendRow([newId, name, desc, tags]);
}

function addVaga(vaga) {
  const requiredFields = ['title', 'company'];
  for (const field of requiredFields) {
    if (!vaga[field]) {
      throw new Error(`O campo ${field} é obrigatório.`);
    }
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("VAGAS");
  const newId = getNewId(sheet);
  sheet.appendRow([newId, vaga.title, vaga.company, vaga.senioridade, vaga.link, vaga.tags, vaga.contato, vaga.email, "Aberta"]);
}

function getGems() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("GEMS");
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    return [];
  }
  return data.slice(1).map(row => ({id: row[0], name: row[1]}));
}

function getGemById(id) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("GEMS");
    const gemRow = findRowById(sheet, id);
    if (gemRow) {
        const gemValues = gemRow.getValues()[0];
        return { id: gemValues[0], name: gemValues[1], desc: gemValues[2], tags: gemValues[3] };
    }
    return null;
}

function updateGem(gem) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("GEMS");
    const gemRow = findRowById(sheet, gem.id);
    if (gemRow) {
        gemRow.setValues([[gem.id, gem.name, gem.desc, gem.tags]]);
    }
}

function deleteGem(id) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("GEMS");
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
        if (data[i][0] == id) {
            sheet.deleteRow(i + 1);
            return;
        }
    }
}

function getEmailsForCopy() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("EMAILS");
    const data = sheet.getDataRange().getValues();
    if (data.length < 2) {
        return [];
    }
    return data.slice(1).map((row, index) => ({
        row: index + 2, // Sheet rows are 1-indexed, and we skip the header
        empresa: row[1],
        contato: row[2]
    }));
}

function getMessageText(row) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("EMAILS");
    return sheet.getRange(row, 5).getValue();
}

function addCandidatura(candidatura) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("CANDIDATURAS");
  const newId = getNewId(sheet);
  const today = new Date();
  sheet.appendRow([newId, candidatura.vagaId, candidatura.gemId, today, candidatura.status]);
}

function getCandidaturas() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const candidaturasSheet = ss.getSheetByName("CANDIDATURAS");
    const vagasSheet = ss.getSheetByName("VAGAS");
    const gemsSheet = ss.getSheetByName("GEMS");

    const candidaturasData = candidaturasSheet.getDataRange().getValues().slice(1);
    const vagasData = vagasSheet.getDataRange().getValues().slice(1);
    const gemsData = gemsSheet.getDataRange().getValues().slice(1);

    const vagasMap = new Map(vagasData.map(row => [row[0], row[1]]));
    const gemsMap = new Map(gemsData.map(row => [row[0], row[1]]));

    return candidaturasData.map(row => ({
        id: row[0],
        vagaId: row[1],
        gemId: row[2],
        status: row[4],
        vagaName: vagasMap.get(row[1]) || "Vaga Desconhecida",
        gemName: gemsMap.get(row[2]) || "GEMS Desconhecido"
    }));
}

function getCandidaturaById(id) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("CANDIDATURAS");
    const row = findRowById(sheet, id);
    if (row) {
        const values = row.getValues()[0];
        // Returns a detailed object for editing
        return { id: values[0], vagaId: values[1], gemId: values[2], status: values[4] };
    }
    return null;
}

function updateCandidatura(candidatura) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("CANDIDATURAS");
    const row = findRowById(sheet, candidatura.id);
    if (row) {
        const originalDate = row.getValues()[0][3]; // Preserve the original application date
        row.setValues([[candidatura.id, candidatura.vagaId, candidatura.gemId, originalDate, candidatura.status]]);
    }
}

function deleteCandidatura(id) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("CANDIDATURAS");
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
        if (data[i][0] == id) {
            sheet.deleteRow(i + 1);
            return;
        }
    }
}

function onEdit(e) {
  const range = e.range;
  const sheet = range.getSheet();
  const sheetName = sheet.getName();

  if (sheetName === "DASHBOARD" && (range.getA1Notation() === 'C2' || range.getA1Notation() === 'E2')) {
    createDashboard();
  } else if (sheetName === "VAGAS" || sheetName === "CANDIDATURAS") {
    createDashboard();
  }
}

function getVagas() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("VAGAS");
    const data = sheet.getDataRange().getValues();
    if (data.length < 2) {
        return [];
    }
    return data.slice(1).map(row => ({id: row[0], title: row[1]}));
}

function getVagaById(id) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("VAGAS");
    const vagaRow = findRowById(sheet, id);
    if (vagaRow) {
        const vagaValues = vagaRow.getValues()[0];
        return {
            id: vagaValues[0],
            title: vagaValues[1],
            company: vagaValues[2],
            senioridade: vagaValues[3],
            link: vagaValues[4],
            tags: vagaValues[5],
            contato: vagaValues[6],
            email: vagaValues[7]
        };
    }
    return null;
}

function updateVaga(vaga) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("VAGAS");
    const vagaRow = findRowById(sheet, vaga.id);
    if (vagaRow) {
        vagaRow.setValues([[vaga.id, vaga.title, vaga.company, vaga.senioridade, vaga.link, vaga.tags, vaga.contato, vaga.email, "Aberta"]]);
    }
}

function deleteVaga(id) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("VAGAS");
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
        if (data[i][0] == id) {
            sheet.deleteRow(i + 1);
            return;
        }
    }
}
