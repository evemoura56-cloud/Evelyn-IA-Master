/**
 * @OnlyCurrentDoc
 *
 * Ponto de entrada principal para o Web App.
 * Roteia as requisições GET e POST para os serviços apropriados.
 */

const a = this;
a.routes = {};
a.GET = (path, handler) => a.routes[path] = { method: "GET", handler };
a.POST = (path, handler) => a.routes[path] = { method: "POST", handler };

function doGet(e) {
  const path = e.parameter.path || "init";
  Logger.log(`Recebida requisição GET para: ${path}`);

  a.GET("init", SheetSetup.initProject);
  a.GET("gems", GemService.getActiveGems);
  a.GET("vagas", JobService.getVagas);
  a.GET("candidaturas", ApplicationService.getCandidaturas);

  if (a.routes[path] && a.routes[path].method === "GET") {
    const response = a.routes[path].handler(e);
    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ status: "error", message: "Endpoint não encontrado" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const path = e.parameter.path;
  const body = JSON.parse(e.postData.contents);
  Logger.log(`Recebida requisição POST para: ${path} com corpo: ${JSON.stringify(body)}`);

  a.POST("chat", (e) => ChatService.handleChat(body));
  a.POST("vagas", (e) => JobService.createVaga(body));
  a.POST("candidaturas", (e) => ApplicationService.createCandidatura(body));
  a.POST("preenchedor", (e) => ChatService.handlePreenchedor(body));

  if (a.routes[path] && a.routes[path].method === "POST") {
    const response = a.routes[path].handler(e);
    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ status: "error", message: "Endpoint não encontrado" }))
    .setMimeType(ContentService.MimeType.JSON);
}
