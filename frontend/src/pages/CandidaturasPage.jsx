import React, { useState, useEffect } from 'react';
import { candidaturasApi } from '../api/candidaturasApi';
import './../styles/tables.css';

const CandidaturasPage = () => {
  const [candidaturas, setCandidaturas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    candidaturasApi.getCandidaturas()
      .then(response => {
        setCandidaturas(response.data);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <h1>Minhas Candidaturas</h1>
      {isLoading ? (
        <p>Carregando candidaturas...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID Vaga</th>
              <th>Data</th>
              <th>Status</th>
              <th>Canal</th>
            </tr>
          </thead>
          <tbody>
            {candidaturas.map(c => (
              <tr key={c.ID_CANDIDATURA}>
                <td>{c.ID_VAGA}</td>
                <td>{c.DATA_CANDIDATURA}</td>
                <td>{c.STATUS_ATUAL}</td>
                <td>{c.CANAL_ENVIO}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CandidaturasPage;
