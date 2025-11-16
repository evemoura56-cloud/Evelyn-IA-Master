/**
 * @OnlyCurrentDoc
 *
 * Funções genéricas para ler e escrever dados nas abas da planilha.
 * Serve como uma camada de abstração para os outros serviços.
 */

const SheetService = {
  getSpreadsheet() {
    // Tenta encontrar a planilha pelo nome. Assume que initProject já foi rodado.
    const files = DriveApp.getFilesByName(SPREADSHEET_NAME);
    if (files.hasNext()) {
      const file = files.next();
      return SpreadsheetApp.openById(file.getId());
    }
    throw new Error("Planilha não encontrada. Execute a função 'initProject' primeiro.");
  },

  getSheetData(sheetName) {
    const ss = this.getSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return [];

    const range = sheet.getDataRange();
    const values = range.getValues();
    if (values.length < 2) return []; // Apenas cabeçalho ou vazio

    const headers = values[0];
    const data = values.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });

    return data;
  },

  appendRow(sheetName, rowData) {
    const ss = this.getSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    const rowValues = headers.map(header => rowData[header] || ""); // Garante a ordem correta

    sheet.appendRow(rowValues);
    return rowData;
  },

  findRow(sheetName, findColumn, findValue) {
    const ss = this.getSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const columnIndex = headers.indexOf(findColumn);

    if (columnIndex === -1) {
      return null;
    }

    for (let i = 1; i < data.length; i++) {
      if (data[i][columnIndex] == findValue) {
        const rowData = {};
        headers.forEach((header, j) => {
          rowData[header] = data[i][j];
        });
        return { rowIndex: i + 1, data: rowData };
      }
    }
    return null;
  },

  updateRow(sheetName, rowIndex, rowData) {
    const ss = this.getSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    headers.forEach((header, index) => {
        if(rowData[header] !== undefined) {
            sheet.getRange(rowIndex, index + 1).setValue(rowData[header]);
        }
    });

    return rowData;
  }
};
