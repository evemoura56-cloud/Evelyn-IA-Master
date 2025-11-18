const REMOTIVE_ENDPOINT = 'https://remotive.com/api/remote-jobs';
const MIN_HOURS = 24;
const MAX_HOURS = 72;

const stripHtml = (value = '') => value
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const detectSenioridade = (title = '') => {
  if (/s[êe]nior/i.test(title)) return 'Sênior';
  if (/pleno/i.test(title)) return 'Pleno';
  if (/j[úu]nior|jr\b/i.test(title)) return 'Júnior';
  return 'Pleno';
};

const normalizeJob = (job, now) => {
  const publishedAt = new Date(job.publication_date);
  const diffHours = Math.round((now - publishedAt) / 36e5);
  return {
    id: job.id,
    titulo: job.title,
    empresa: job.company_name,
    link: job.url,
    senioridade: detectSenioridade(job.title),
    modelo: 'Home office',
    tipoContrato: job.job_type || 'CLT/PJ',
    focoCarreira: job.category || 'Tecnologia',
    stackDesejada: job.tags || [],
    valoresCultura: [],
    origem: 'Remotive',
    descricao: stripHtml(job.description || '').slice(0, 800),
    publicadaEm: job.publication_date,
    horasDesdePublicacao: diffHours
  };
};

export const jobsFeedService = {
  async fetchRecentJobs({ search = '', limit = 40 } = {}) {
    const url = new URL(REMOTIVE_ENDPOINT);
    url.searchParams.set('limit', limit);
    if (search) {
      url.searchParams.set('search', search);
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error('Não foi possível buscar vagas reais agora.');
    }

    const payload = await response.json();
    const now = new Date();

    return (payload.jobs || [])
      .map((job) => normalizeJob(job, now))
      .filter((job) => job.horasDesdePublicacao >= MIN_HOURS && job.horasDesdePublicacao <= MAX_HOURS)
      .slice(0, limit);
  }
};
