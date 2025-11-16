function generateEmailsForVagas(selectedGemId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const vagasSheet = ss.getSheetByName("VAGAS");
  const gemsSheet = ss.getSheetByName("GEMS");
  const emailsSheet = ss.getSheetByName("EMAILS");

  const vagasData = vagasSheet.getRange("B2:H" + vagasSheet.getLastRow()).getValues();
  const gemsData = gemsSheet.getDataRange().getValues();

  if (gemsData.length < 2) {
    throw new Error("Nenhum GEMS encontrado. Adicione pelo menos um GEMS antes de gerar e-mails.");
  }

  let selectedGem;
  if (selectedGemId) {
    const gemRow = findRowById(gemsSheet, selectedGemId);
    if (gemRow) {
      const gemValues = gemRow.getValues()[0];
      selectedGem = { nome: gemValues[1], descricao: gemValues[2], tags: gemValues[3] };
    }
  }

  if (!selectedGem) {
      const defaultGemData = gemsData[1];
      selectedGem = { nome: defaultGemData[1], descricao: defaultGemData[2], tags: defaultGemData[3] };
  }

  emailsSheet.getRange(2, 1, emailsSheet.getLastRow(), emailsSheet.getLastColumn()).clearContent();

  vagasData.forEach((vaga, index) => {
    const idVaga = vagasSheet.getRange(index + 2, 1).getValue();
    const [tituloVaga, empresa, senioridade, linkVaga, tagsTecnicas, contatoRecrutador, emailRecrutador] = vaga;

    if (tituloVaga && empresa) {
      const contato = contatoRecrutador || empresa;
      const email = emailRecrutador;
      const mensagem = createEmailMessage(tituloVaga, empresa, senioridade, tagsTecnicas, selectedGem, linkVaga);

      const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(tituloVaga)}&body=${encodeURIComponent(mensagem)}`;
      const gmailButton = `=HYPERLINK("${gmailLink}", "Abrir Gmail")`;

      emailsSheet.appendRow([idVaga, empresa, contato, email, mensagem, gmailButton, ""]);
    }
  });

  SpreadsheetApp.flush();
}

function createEmailMessage(tituloVaga, empresa, senioridade, tagsTecnicas, gem, linkVaga) {
  let template = `Olá, ${empresa}. Tudo bem?\n
Vi a oportunidade para ${tituloVaga} (${senioridade}) na ${empresa} e identifiquei forte sinergia técnica com meu perfil, especialmente em ${tagsTecnicas || gem.tags}.\n
Gostaria de destacar alguns pontos da minha trajetória que se conectam com os desafios da vaga:\n
Automação com Resultados Reais: ${gem.descricao}\n
Estou muito entusiasmada com a cultura da ${empresa} e pronta para contribuir com a qualidade e eficiência das entregas do time.\n
Meu currículo segue em anexo com mais detalhes técnicos. Fico à disposição para um bate-papo!\n`;

  if (linkVaga) {
    template += `\nLink da Vaga: ${linkVaga}\n`;
  }

  template += `\nAtenciosamente,\n
Evelyn Moura
(11) 97662-9860
LinkedIn: www.linkedin.com/in/evelyn-moura-dos-santos-6a6094211
GitHub: https://github.com/evemoura56-cloud`;

  return template;
}

function exportEmailsToCsv() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("EMAILS");
  const data = sheet.getDataRange().getValues();
  let csvContent = "";

  data.forEach(row => {
    csvContent += row.join(",") + "\n";
  });

  return csvContent;
}
