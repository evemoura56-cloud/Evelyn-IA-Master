function createDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let dashboardSheet = ss.getSheetByName("DASHBOARD");

  if (dashboardSheet) {
    dashboardSheet.clear();
  } else {
    dashboardSheet = ss.insertSheet("DASHBOARD");
  }

  // Set up dashboard layout
  dashboardSheet.getRange("A1:I25").setBackground("#111827");
  dashboardSheet.getRange("A1:I1").merge().setValue("Dashboard de Performance").setFontColor("#F9FAFB").setFontSize(24).setHorizontalAlignment("center").setVerticalAlignment("middle");
  dashboardSheet.getRange("A1:I1").setFontFamily("Inter").setFontWeight("bold");

  // --- Filters ---
  dashboardSheet.getRange("B2").setValue("Senioridade:").setFontColor("#9CA3AF").setFontSize(12).setHorizontalAlignment("right");
  const senioridadeRule = SpreadsheetApp.newDataValidation().requireValueInList(getUniqueValues("VAGAS", "D2:D")).build();
  dashboardSheet.getRange("C2").setDataValidation(senioridadeRule).setFontColor("#F9FAFB").setBackground("#374151");

  dashboardSheet.getRange("D2").setValue("Status:").setFontColor("#9CA3AF").setFontSize(12).setHorizontalAlignment("right");
  const statusRule = SpreadsheetApp.newDataValidation().requireValueInList(getUniqueValues("CANDIDATURAS", "E2:E")).build();
  dashboardSheet.getRange("E2").setDataValidation(statusRule).setFontColor("#F9FAFB").setBackground("#374151");


  const selectedSenioridade = dashboardSheet.getRange("C2").getValue();
  const selectedStatus = dashboardSheet.getRange("E2").getValue();

  // Filter data
  const vagasSheet = ss.getSheetByName("VAGAS");
  const candidaturasSheet = ss.getSheetByName("CANDIDATURAS");
  const vagasData = vagasSheet.getDataRange().getValues();
  const candidaturasData = candidaturasSheet.getDataRange().getValues();

  let filteredVagas = vagasData.slice(1);
  if (selectedSenioridade) {
      filteredVagas = filteredVagas.filter(row => row[3] === selectedSenioridade);
  }

  let filteredCandidaturas = candidaturasData.slice(1);
  if (selectedStatus) {
      filteredCandidaturas = filteredCandidaturas.filter(row => row[4] === selectedStatus);
  }

  // --- KPIs ---
  const totalVagas = filteredVagas.length;
  const totalCandidaturas = filteredCandidaturas.length;
  const approvedCount = filteredCandidaturas.filter(row => row[4] === 'Aprovado').length;

  dashboardSheet.getRange("B3").setValue("Total de Vagas").setFontColor("#9CA3AF").setFontSize(12);
  dashboardSheet.getRange("B4").setValue(totalVagas).setFontColor("#F9FAFB").setFontSize(28).setFontWeight("bold");

  dashboardSheet.getRange("D3").setValue("Total de Candidaturas").setFontColor("#9CA3AF").setFontSize(12);
  dashboardSheet.getRange("D4").setValue(totalCandidaturas).setFontColor("#F9FAFB").setFontSize(28).setFontWeight("bold");

  dashboardSheet.getRange("F3").setValue("Aprovações").setFontColor("#9CA3AF").setFontSize(12);
  dashboardSheet.getRange("F4").setValue(approvedCount).setFontColor("#10B981").setFontSize(28).setFontWeight("bold");

  // --- Charts ---
  // Pie Chart for Vagas por Senioridade
  const senioridadeCounts = countOccurrences(filteredVagas.map(row => row[3]));
  const senioridadeChartData = Charts.newDataTable()
      .addColumn(Charts.ColumnType.STRING, "Senioridade")
      .addColumn(Charts.ColumnType.NUMBER, "Contagem");
  for (const seniority in senioridadeCounts) {
    senioridadeChartData.addRow([seniority, senioridadeCounts[seniority]]);
  }

  const pieChart = Charts.newPieChart()
      .setDataTable(senioridadeChartData)
      .setTitle("Vagas por Senioridade")
      .setOption("backgroundColor", "#1F2937")
      .setOption("titleTextStyle", {color: '#F9FAFB', fontSize: 16})
      .setOption("legendTextStyle", {color: '#F9FAFB'})
      .setOption("pieSliceTextStyle", {color: '#F9FAFB'})
      .setOption("colors", ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"])
      .build();

  dashboardSheet.insertChart(pieChart).setPosition(6, 2, 0, 0);

  // Bar Chart for Candidaturas por Status
  const statusCounts = countOccurrences(filteredCandidaturas.map(row => row[4]));
  const statusChartData = Charts.newDataTable()
    .addColumn(Charts.ColumnType.STRING, "Status")
    .addColumn(Charts.ColumnType.NUMBER, "Contagem");
  for (const status in statusCounts) {
    statusChartData.addRow([status, statusCounts[status]]);
  }

  const barChart = Charts.newBarChart()
    .setDataTable(statusChartData)
    .setTitle("Candidaturas por Status")
    .setOption("backgroundColor", "#1F2937")
    .setOption("titleTextStyle", {color: '#F9FAFB', fontSize: 16})
    .setOption("hAxis", {textStyle: {color: '#9CA3AF'}})
    .setOption("vAxis", {textStyle: {color: '#9CA3AF'}})
    .setOption("colors", ["#3B82F6"])
    .build();

  dashboardSheet.insertChart(barChart).setPosition(6, 5, 0, 0);
}

function countOccurrences(arr) {
  return arr.reduce((acc, curr) => (acc[curr] = (acc[curr] || 0) + 1, acc), {});
}
