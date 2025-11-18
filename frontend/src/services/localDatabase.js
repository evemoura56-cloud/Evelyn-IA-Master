import { defaultState } from '../data/defaultState';

const STORAGE_KEY = 'evelyn-ia-master:db';
const MAX_PERSONAS = 7;

const deepClone = (data) => JSON.parse(JSON.stringify(data));

const createId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

const getStorage = () => (typeof window !== 'undefined' ? window.localStorage : null);

let memoryState = deepClone(defaultState);

const readState = () => {
  const storage = getStorage();
  if (!storage) {
    return memoryState;
  }
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) {
    storage.setItem(STORAGE_KEY, JSON.stringify(memoryState));
    return memoryState;
  }
  try {
    const parsed = JSON.parse(raw);
    memoryState = parsed;
    return parsed;
  } catch (error) {
    console.error('Falha ao ler o banco local, restaurando padrão.', error);
    storage.setItem(STORAGE_KEY, JSON.stringify(memoryState));
    return memoryState;
  }
};

const persistState = (state) => {
  memoryState = state;
  const storage = getStorage();
  if (storage) {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
};

const updateState = (updater) => {
  const current = deepClone(readState());
  const updated = updater(current);
  persistState(updated);
  return deepClone(updated);
};

const slugify = (value = '') => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '')
  || `persona-${Math.random().toString(36).slice(2, 6)}`;

const ensureUniqueSlug = (slug, personas) => {
  let uniqueSlug = slug;
  let counter = 1;
  while (personas.some((persona) => persona.slug === uniqueSlug)) {
    uniqueSlug = `${slug}-${counter}`;
    counter += 1;
  }
  return uniqueSlug;
};

const calculateCompatibility = (vaga, persona) => {
  let score = 45;
  const motivos = [];

  if (persona.senioridadePreferida === vaga.senioridade) {
    score += 20;
    motivos.push('Senioridade alinhada.');
  }

  const vagaStack = vaga.stackDesejada || [];
  const vagaValores = vaga.valoresCultura || [];
  const stackOverlap = vagaStack.filter((skill) => persona.especialidades
    .some((especialidade) => especialidade.toLowerCase() === skill.toLowerCase()));
  if (stackOverlap.length) {
    score += stackOverlap.length * 8;
    motivos.push(`Experiência direta com ${stackOverlap.join(', ')}.`);
  }

  if (persona.valores.some((valor) => vagaValores.includes(valor))) {
    score += 10;
    motivos.push('Valores culturais compatíveis.');
  }

  if (persona.interesses.some((interesse) => (vaga.modelo || '').toLowerCase().includes(interesse))) {
    score += 5;
    motivos.push('Modelo de trabalho desejado.');
  }

  score = Math.min(100, score);

  return {
    personaSlug: persona.slug,
    personaNome: persona.nome,
    score: Math.round(score),
    nivel: score >= 80 ? 'Excelente' : score >= 60 ? 'Boa' : score >= 45 ? 'Moderada' : 'Baixa',
    motivos
  };
};

const buildPrefilledLink = (vaga, persona) => {
  const params = new URLSearchParams({
    vaga: vaga.titulo,
    empresa: vaga.empresa,
    persona: persona.nome,
    foco: persona.focoCarreira
  });
  const base = vaga.link || 'https://example.com/candidatura';
  const glue = base.includes('?') ? '&' : '?';
  return `${base}${glue}${params.toString()}`;
};

const simulateChatResponse = (persona, message) => {
  const highlight = message.slice(0, 140);
  const sugestao = persona.especialidades.length ? persona.especialidades[0] : 'experiência acumulada';
  return `Aqui é ${persona.nome}! Você mencionou: "${highlight}". Minha leitura, com base no meu estilo ${persona.personalidade.toLowerCase()}, é que podemos agir focando em ${sugestao}. ${persona.instrucoes}`;
};

const toList = (value) => (value || '')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

export const localDatabase = {
  MAX_PERSONAS,
  reset: () => {
    const state = deepClone(defaultState);
    persistState(state);
    return state;
  },
  getState: () => deepClone(readState()),
  getPersonas: () => deepClone(readState().personas),
  addPersona: (personaData) => {
    const state = readState();
    if (state.personas.length >= MAX_PERSONAS) {
      throw new Error(`Limite de ${MAX_PERSONAS} personas atingido.`);
    }
    const slugBase = slugify(personaData.nome || 'persona');
    const slug = ensureUniqueSlug(slugBase, state.personas);
    const persona = {
      id: createId('persona'),
      slug,
      nome: personaData.nome,
      descricao: personaData.descricao,
      instrucoes: personaData.instrucoes,
      personalidade: personaData.personalidade,
      tom: personaData.tom,
      especialidades: toList(personaData.especialidades),
      focoCarreira: personaData.focoCarreira,
      senioridadePreferida: personaData.senioridadePreferida,
      valores: toList(personaData.valores),
      interesses: toList(personaData.interesses)
    };

    state.personas.push(persona);
    persistState(state);
    return deepClone(persona);
  },
  getPersonaBySlug: (slug) => readState().personas.find((persona) => persona.slug === slug),
  getVagas: () => {
    const state = readState();
    const personas = state.personas;
    return state.vagas.map((vaga) => ({
      ...vaga,
      compatibilidades: personas.map((persona) => calculateCompatibility(vaga, persona))
    }));
  },
  createVaga: (data) => updateState((draft) => {
    const vaga = {
      id: createId('vaga'),
      titulo: data.titulo,
      empresa: data.empresa,
      senioridade: data.senioridade,
      modelo: data.modelo,
      tipoContrato: data.tipoContrato,
      focoCarreira: data.focoCarreira,
      stackDesejada: toList(data.stackDesejada),
      valoresCultura: toList(data.valoresCultura),
      link: data.link,
      status: data.status || 'Em avaliação',
      origem: data.origem,
      descricao: data.descricao
    };
    draft.vagas.unshift(vaga);
    return draft;
  }),
  getCandidaturas: () => deepClone(readState().candidaturas),
  createCandidatura: (data) => updateState((draft) => {
    draft.candidaturas.unshift({
      id: createId('cand'),
      vagaId: data.vagaId,
      data: data.data,
      status: data.status,
      canal: data.canal,
      personaSlug: data.personaSlug,
      observacoes: data.observacoes
    });
    return draft;
  }),
  sendChatMessage: (personaSlug, userMessage, conversationId = null) => {
    const persona = readState().personas.find((item) => item.slug === personaSlug);
    if (!persona) {
      throw new Error('Persona não encontrada.');
    }
    const assistantMessage = simulateChatResponse(persona, userMessage);
    return {
      conversationId: conversationId || createId('conv'),
      assistantMessage
    };
  },
  gerarTextoPreenchedor: ({ personaSlug, dadosVaga, perfilCandidata, tom }) => {
    const persona = readState().personas.find((item) => item.slug === personaSlug);
    if (!persona) {
      throw new Error('Persona não encontrada.');
    }
    const pontosForte = persona.especialidades.slice(0, 3).join(', ');
    return {
      mensagemParaRecrutador: `Olá! Sou ${perfilCandidata.trim()}. Baseada no olhar da ${persona.nome}, destaco que ${dadosVaga.trim()} se beneficia do meu repertório em ${pontosForte}. Seguindo um tom ${tom}, estou pronta para avançar.`,
      resumoPersonalizado: `${persona.personalidade} + foco em ${persona.focoCarreira}. Prioridade: ${persona.instrucoes}`,
      bulletsMotivos: [
        `Compatibilidade cultural com ${persona.valores.join(', ')}.`,
        `Stack desejada contemplada: ${persona.especialidades.join(', ')}.`,
        `Plano de ação claro conduzido pela persona ${persona.nome}.`
      ]
    };
  },
  regeneratePrefilledLinks: () => updateState((draft) => {
    const personas = draft.personas;
    const links = [];
    draft.vagas.forEach((vaga) => {
      personas.forEach((persona) => {
        const compat = calculateCompatibility(vaga, persona);
        if (compat.score >= 60) {
          links.push({
            id: createId('link'),
            vagaId: vaga.id,
            vagaTitulo: vaga.titulo,
            empresa: vaga.empresa,
            personaSlug: persona.slug,
            personaNome: persona.nome,
            url: buildPrefilledLink(vaga, persona),
            score: compat.score,
            motivos: compat.motivos,
            criadoEm: new Date().toISOString()
          });
        }
      });
    });
    draft.prefilledLinks = links;
    return draft;
  }),
  getPrefilledLinks: () => deepClone(readState().prefilledLinks)
};
