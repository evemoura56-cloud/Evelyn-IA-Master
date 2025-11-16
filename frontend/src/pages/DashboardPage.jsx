import React from 'react';

const DashboardPage = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bem-vinda ao Evelyn GEMS Hub!</p>
      <p>Esta área mostrará um resumo das suas atividades, como o total de vagas e o status das suas candidaturas. Os gráficos e dados virão diretamente da aba "DASHBOARD" da sua planilha.</p>
      {/* No futuro, poderíamos buscar os dados da planilha e renderizar aqui */}
    </div>
  );
};

export default DashboardPage;
