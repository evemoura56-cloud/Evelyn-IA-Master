export const defaultState = {
  personas: [
    {
      id: 'persona-1',
      slug: 'evelyn-pro-vagas',
      nome: 'Evelyn PRO – Vagas',
      descricao: 'Especialista em oportunidades tech que cruza cultura, senioridade e rituais de produto.',
      instrucoes: 'Mapeie o contexto completo da vaga, traduza requisitos técnicos em plano prático e sugira próximos passos claros.',
      personalidade: 'Analítica, acolhedora e orientada a métricas.',
      tom: 'Profissional e encorajador',
      especialidades: ['Produto digital', 'UX Research', 'Design System'],
      focoCarreira: 'Produto',
      senioridadePreferida: 'Pleno',
      valores: ['Impacto real', 'Autonomia', 'Cultura colaborativa'],
      interesses: ['fintech', 'remoto', 'times distribuídos']
    },
    {
      id: 'persona-2',
      slug: 'codex-dev',
      nome: 'Codex DEV Mentor',
      descricao: 'Mentor técnico apaixonado por engenharia moderna e boas práticas.',
      instrucoes: 'Destrinche problemas complexos em passos acionáveis, valide hipóteses e proponha experimentos.',
      personalidade: 'Direta, bem-humorada e curiosa.',
      tom: 'Casual técnico',
      especialidades: ['Frontend', 'Node.js', 'Automação'],
      focoCarreira: 'Engenharia de software',
      senioridadePreferida: 'Sênior',
      valores: ['Aprendizado contínuo', 'Comunicação transparente'],
      interesses: ['startups', 'IA aplicada', 'produtos B2B']
    }
  ],
  vagas: [
    {
      id: 'vaga-1',
      titulo: 'Product Designer Pleno',
      empresa: 'Aurora Bank',
      senioridade: 'Pleno',
      modelo: 'Home office',
      tipoContrato: 'CLT',
      focoCarreira: 'Produto',
      stackDesejada: ['Figma', 'Design System', 'Pesquisa qualitativa'],
      valoresCultura: ['Impacto real', 'Diversidade'],
      link: 'https://jobs.aurorabank.com/product-designer',
      status: 'Recebendo candidaturas',
      origem: 'LinkedIn',
      descricao: 'Banco digital procura designer com visão sistêmica para evoluir seu aplicativo mobile.'
    },
    {
      id: 'vaga-2',
      titulo: 'Front-end Engineer React',
      empresa: 'Nebula Analytics',
      senioridade: 'Sênior',
      modelo: 'Híbrido',
      tipoContrato: 'PJ',
      focoCarreira: 'Engenharia de software',
      stackDesejada: ['React', 'TypeScript', 'Testes automatizados'],
      valoresCultura: ['Autonomia', 'Transparência'],
      link: 'https://jobs.nebula.ai/frontend',
      status: 'Prioritária',
      origem: 'Indicação',
      descricao: 'Startup de dados busca liderança técnica para squads de visualização.'
    }
  ],
  candidaturas: [
    {
      id: 'cand-1',
      vagaId: 'vaga-1',
      data: '2024-02-16',
      status: 'Entrevista de cultura',
      canal: 'LinkedIn',
      personaSlug: 'evelyn-pro-vagas',
      observacoes: 'Aguardando retorno do RH.'
    },
    {
      id: 'cand-2',
      vagaId: 'vaga-2',
      data: '2024-03-04',
      status: 'Proposta enviada',
      canal: 'Indicação',
      personaSlug: 'codex-dev',
      observacoes: 'Negociando pacote de ações.'
    }
  ],
  prefilledLinks: []
};
