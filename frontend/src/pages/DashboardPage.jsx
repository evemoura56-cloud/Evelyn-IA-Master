import React, { useEffect, useState } from 'react';
import { gemsApi } from '../api/gemsApi';
import { vagasApi } from '../api/vagasApi';
import { candidaturasApi } from '../api/candidaturasApi';
import { linksApi } from '../api/linksApi';
import './../styles/modules.css';
import './../styles/tables.css';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ personas: 0, vagas: 0, candidaturas: 0, links: 0 });
  const [topPersona, setTopPersona] = useState(null);
  const [candidaturas, setCandidaturas] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [personasRes, vagasRes, candidaturasRes, linksRes] = await Promise.all([
        gemsApi.getGems(),
        vagasApi.getVagas(),
        candidaturasApi.getCandidaturas(),
        linksApi.list()
      ]);

      const personas = personasRes.data;
      const vagas = vagasRes.data;
      const candidaturasData = candidaturasRes.data;
      const links = linksRes.data;

      const personaScores = personas.map((persona) => {
        const compatList = vagas.flatMap((vaga) => (vaga.compatibilidades || [])
          .filter((compat) => compat.personaSlug === persona.slug));
        const media = compatList.length
          ? Math.round(compatList.reduce((total, compat) => total + compat.score, 0) / compatList.length)
          : 0;
        return { persona, media, total: compatList.length };
      }).sort((a, b) => b.media - a.media);

      setStats({
        personas: personas.length,
        vagas: vagas.length,
        candidaturas: candidaturasData.length,
        links: links.length
      });
      setTopPersona(personaScores[0]);
      setCandidaturas(candidaturasData.slice(0, 4));
      setLoading(false);
    };

    load();
  }, []);

  return (
    <div>
      <header className="page-header">
        <div>
          <h1>Evelyn Mater — visão geral</h1>
          <p>Tudo que você vê aqui está rodando 100% local: personas, vagas, chat e links prontos.</p>
        </div>
      </header>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <section className="cards-grid">
            <article className="stat-card">
              <span>Personas</span>
              <strong>{stats.personas}</strong>
            </article>
            <article className="stat-card">
              <span>Vagas mapeadas</span>
              <strong>{stats.vagas}</strong>
            </article>
            <article className="stat-card">
              <span>Candidaturas</span>
              <strong>{stats.candidaturas}</strong>
            </article>
            <article className="stat-card">
              <span>Links prontos</span>
              <strong>{stats.links}</strong>
            </article>
          </section>

          {topPersona?.persona && (
            <section className="persona-card">
              <header>
                <div>
                  <h3>{topPersona.persona.nome}</h3>
                  <small>Melhor match médio: {topPersona.media}% em {topPersona.total} vagas</small>
                </div>
              </header>
              <p className="persona-description">{topPersona.persona.descricao}</p>
              <div className="chips-row">
                {topPersona.persona.especialidades.map((skill) => (
                  <span className="pill" key={skill}>{skill}</span>
                ))}
              </div>
              <small>{topPersona.persona.instrucoes}</small>
            </section>
          )}

          <section>
            <h2>Últimas candidaturas</h2>
            {candidaturas.length === 0 ? (
              <p>Cadastre candidaturas para acompanhar o funil.</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Vaga</th>
                    <th>Status</th>
                    <th>Canal</th>
                  </tr>
                </thead>
                <tbody>
                  {candidaturas.map((candidatura) => (
                    <tr key={candidatura.id}>
                      <td>{candidatura.vagaId}</td>
                      <td>{candidatura.status}</td>
                      <td>{candidatura.canal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
