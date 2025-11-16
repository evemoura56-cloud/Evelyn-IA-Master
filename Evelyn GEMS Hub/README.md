# Evelyn GEMS Hub

O Evelyn GEMS Hub é um sistema completo para gestão de candidaturas de emprego, construído 100% com Google Sheets e Google Apps Script. Ele foi projetado para ser uma ferramenta poderosa e intuitiva, com uma interface moderna e funcionalidades automatizadas, sem depender de APIs externas ou integrações complexas.

## ✨ Funcionalidades

- **Gestão de GEMS/Personas:** Crie e gerencie diferentes perfis profissionais (GEMS) para adaptar suas candidaturas.
- **CRUD de Vagas e Candidaturas:** Controle todas as suas vagas e o status de cada candidatura em um só lugar.
- **Geração de E-mails Automatizados:** Crie mensagens de e-mail personalizadas para cada vaga com base em templates inteligentes.
- **Dashboard Interativo:** Visualize seus dados com KPIs, gráficos de pizza e gráficos de barras dinâmicos.
- **Interface Moderna:** Desfrute de uma interface de usuário no estilo Linear/Vercel/Notion, com tema escuro e elementos interativos.
- **Exportação para CSV:** Exporte facilmente os dados de e-mail para usar em outras ferramentas.
- **Cópia Fácil de Mensagens:** Selecione um e-mail na barra lateral para carregar o texto da mensagem em uma caixa de texto, tornando a cópia manual rápida e fácil.

## 🚀 Como Começar

### 1. Faça uma Cópia da Planilha

Para começar, faça uma cópia desta planilha para sua própria conta do Google Drive.

### 2. Execute a Função de Setup

Depois de copiar a planilha, siga estes passos para configurar o sistema:

1. Abra o editor de scripts em `Extensions > Apps Script`.
2. No editor, selecione a função `setup` no menu suspenso.
3. Clique em `Run` para executar a função.
4. Você será solicitado a autorizar o script. Conceda as permissões necessárias.

A função `setup` criará todas as abas necessárias, aplicará a formatação e deixará o sistema pronto para uso.

### 3. Use a Barra Lateral

Para acessar as funcionalidades do sistema, use a barra lateral que aparece ao abrir a planilha. Se ela não aparecer, você pode abri-la manualmente em `✨ GEMS Hub > Iniciar`.

## 📖 Como Usar

### GEMS

- **Adicionar GEMS:** Use o formulário na barra lateral para adicionar novos perfis profissionais.
- **Gerenciar GEMS:** Edite ou remova GEMS diretamente na aba "GEMS".

### Vagas

- **Adicionar Vagas:** Use o formulário na barra lateral para adicionar novas vagas.
- **Gerenciar Vagas:** Acompanhe o status das vagas e adicione mais detalhes na aba "VAGAS".

### Candidaturas

- **Adicionar Candidatura:** Use o formulário na barra lateral para registrar uma nova candidatura, vinculando uma vaga a um GEMS.
- **Gerenciar Candidaturas:** Atualize o status ou exclua candidaturas usando a seção "Candidaturas" na barra lateral.

### E-mails

- **Gerar E-mails:** Clique no botão "Gerar Emails" na barra lateral para criar mensagens personalizadas para cada vaga.
- **Abrir no Gmail:** Use o botão "Abrir no Gmail" na aba "EMAILS" para abrir uma nova mensagem de e-mail com o conteúdo pré-preenchido.
- **Exportar CSV:** Clique no botão "Exportar CSV" para baixar um arquivo CSV com os dados de e-mail.

### Dashboard

- **Atualizar Dashboard:** A aba "DASHBOARD" é atualizada automaticamente sempre que você edita as abas "VAGAS" ou "CANDIDATURAS". Você também pode forçar uma atualização manual a qualquer momento indo em `✨ GEMS Hub > Atualizar Dashboard`.
- **Filtros Interativos:** Use os menus suspensos na parte superior do dashboard para filtrar os gráficos por "Senioridade" e "Status".

## 📸 Preview

(Aqui você pode adicionar um screenshot do dashboard ou da interface da planilha)
