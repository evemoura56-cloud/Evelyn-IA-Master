import React, { useEffect, useState } from 'react';
import { linksApi } from '../api/linksApi';
import './../styles/tables.css';
import './../styles/modules.css';

const LinksPage = () => {
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const loadLinks = async () => {
    setIsLoading(true);
    const response = await linksApi.list();
    setLinks(response.data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadLinks();
  }, []);

  const regenerate = async () => {
    setIsRegenerating(true);
    const response = await linksApi.regenerate();
    setLinks(response.data);
    setIsRegenerating(false);
  };

  return (
    <div className="links-page">
      <header className="page-header">
        <div>
          <h1>Links pré-preenchidos</h1>
          <p>Geramos links combinando compatibilidade entre vagas e personas. Basta clicar para abrir, revisar e enviar manualmente.</p>
        </div>
        <button type="button" className="primary" onClick={regenerate} disabled={isRegenerating}>
          {isRegenerating ? 'Atualizando...' : 'Regerar lista'}
        </button>
      </header>

      {isLoading ? (
        <p>Carregando links...</p>
      ) : links.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum link disponível. Cadastre vagas e clique em "Regerar lista".</p>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Vaga</th>
              <th>Persona</th>
              <th>Compatibilidade</th>
              <th>Motivos</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link.id}>
                <td>
                  <strong>{link.vagaTitulo}</strong>
                  <br />
                  <small>{link.empresa}</small>
                </td>
                <td>{link.personaNome}</td>
                <td>
                  <span className="pill">{link.score}%</span>
                </td>
                <td>
                  <ul>
                    {link.motivos.map((motivo, index) => (
                      <li key={index}>{motivo}</li>
                    ))}
                  </ul>
                </td>
                <td>
                  <a href={link.url} target="_blank" rel="noreferrer">Abrir</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LinksPage;
