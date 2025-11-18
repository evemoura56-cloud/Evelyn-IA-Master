import React, { useEffect, useState } from 'react';
import { candidaturasApi } from '../api/candidaturasApi';
import { vagasApi } from '../api/vagasApi';
import { gemsApi } from '../api/gemsApi';
import './../styles/forms.css';
import './../styles/tables.css';

const emptyForm = {
  vagaId: '',
  data: '',
  status: 'Em andamento',
  canal: 'LinkedIn',
  personaSlug: '',
  observacoes: ''
};

const CandidaturasPage = () => {
  const [candidaturas, setCandidaturas] = useState([]);
  const [vagas, setVagas] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [formState, setFormState] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    const [candidaturasRes, vagasRes, personasRes] = await Promise.all([
      candidaturasApi.getCandidaturas(),
      vagasApi.getVagas(),
      gemsApi.getGems()
    ]);
    const vagasList = vagasRes.data;
    const personasList = personasRes.data;
    setCandidaturas(candidaturasRes.data);
    setVagas(vagasList);
    setPersonas(personasList);
    setIsLoading(false);
    return { vagasList, personasList };
  };

  useEffect(() => {
    loadData().then(({ vagasList, personasList }) => {
      setFormState((prev) => ({
        ...prev,
        vagaId: prev.vagaId || vagasList[0]?.id || '',
        personaSlug: prev.personaSlug || personasList[0]?.slug || ''
      }));
    });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await candidaturasApi.createCandidatura(formState);
      const { vagasList, personasList } = await loadData();
      setFormState({
        ...emptyForm,
        vagaId: vagasList[0]?.id || '',
        personaSlug: personasList[0]?.slug || ''
      });
    } catch (error) {
      alert(error.message || 'Erro ao salvar candidatura.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1>Candidaturas</h1>
      <form className="form-container" onSubmit={handleSubmit}>
        <h2>Adicionar candidatura</h2>
        <select name="vagaId" value={formState.vagaId} onChange={handleChange} required>
          <option value="">Selecione a vaga</option>
          {vagas.map((vaga) => (
            <option key={vaga.id} value={vaga.id}>{vaga.titulo}</option>
          ))}
        </select>
        <select name="personaSlug" value={formState.personaSlug} onChange={handleChange} required>
          <option value="">Persona responsável</option>
          {personas.map((persona) => (
            <option key={persona.slug} value={persona.slug}>{persona.nome}</option>
          ))}
        </select>
        <input type="date" name="data" value={formState.data} onChange={handleChange} required />
        <input name="status" value={formState.status} onChange={handleChange} placeholder="Status" />
        <input name="canal" value={formState.canal} onChange={handleChange} placeholder="Canal" />
        <textarea name="observacoes" value={formState.observacoes} onChange={handleChange} rows="3" placeholder="Observações" />
        <button type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Registrar candidatura'}</button>
      </form>

      {isLoading ? (
        <p>Carregando candidaturas...</p>
      ) : candidaturas.length === 0 ? (
        <p>Nenhuma candidatura registrada ainda.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Vaga</th>
              <th>Data</th>
              <th>Status</th>
              <th>Canal</th>
            </tr>
          </thead>
          <tbody>
            {candidaturas.map((candidatura) => (
              <tr key={candidatura.id}>
                <td>{candidatura.vagaId}</td>
                <td>{candidatura.data}</td>
                <td>{candidatura.status}</td>
                <td>{candidatura.canal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CandidaturasPage;
