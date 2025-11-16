/**
 * Utility functions for the Evelyn GEMS Hub.
 */

/**
 * Generates a unique ID for new rows.
 * @param {Sheet} sheet The sheet to generate the ID for.
 * @return {number} The new unique ID.
 */
function getNewId(sheet) {
  const data = sheet.getRange("A2:A").getValues().flat().filter(String);
  if (data.length === 0) {
    return 1;
  }
  return Math.max(...data) + 1;
}

/**
 * Finds a specific row in a sheet by its ID.
 * @param {Sheet} sheet The sheet to search in.
 * @param {number} id The ID to search for.
 * @return {Range | null} The range of the found row, or null if not found.
 */
function findRowById(sheet, id) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == id) {
      return sheet.getRange(i + 1, 1, 1, sheet.getLastColumn());
    }
  }
  return null;
}

/**
 * Gets unique values from a specified column in a sheet.
 * @param {string} sheetName The name of the sheet.
 * @param {string} rangeString The column range to get unique values from.
 * @return {Array<string>} An array of unique values.
 */
function getUniqueValues(sheetName, rangeString) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const values = sheet.getRange(rangeString).getValues().flat().filter(String);
  return [...new Set(values)];
}
