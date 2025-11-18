import React, { useEffect, useState } from 'react';
import { vagasApi } from '../api/vagasApi';
import { gemsApi } from '../api/gemsApi';
import './../styles/forms.css';
import './../styles/tables.css';
import './../styles/modules.css';

const initialForm = {
  titulo: '',
  empresa: '',
  link: '',
  senioridade: 'Pleno',
  modelo: 'Home office',
  tipoContrato: 'CLT',
  focoCarreira: 'Produto',
  stackDesejada: '',
  valoresCultura: '',
  origem: 'LinkedIn',
  descricao: '',
  status: 'Em avaliação'
};

const VagasPage = () => {
  const [vagas, setVagas] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [selectedPersona, setSelectedPersona] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formState, setFormState] = useState(initialForm);

  const loadVagas = async () => {
    setIsLoading(true);
    const response = await vagasApi.getVagas();
    setVagas(response.data);
    setIsLoading(false);
  };

  const loadPersonas = async () => {
    const response = await gemsApi.getGems();
    setPersonas(response.data);
    if (!selectedPersona && response.data.length) {
      setSelectedPersona(response.data[0].slug);
    }
  };

  useEffect(() => {
    loadVagas();
    loadPersonas();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await vagasApi.createVaga(formState);
      setFormState(initialForm);
      await loadVagas();
    } catch (error) {
      alert(error.message || 'Não foi possível salvar a vaga.');
    } finally {
      setSaving(false);
    }
  };

  const getCompatibilidade = (vaga) => {
    if (!vaga.compatibilidades || vaga.compatibilidades.length === 0) {
      return null;
    }
    return selectedPersona
      ? vaga.compatibilidades.find((compat) => compat.personaSlug === selectedPersona) || vaga.compatibilidades[0]
      : vaga.compatibilidades[0];
  };

  return (
    <div className="vagas-page">
      <header className="page-header">
        <div>
          <h1>Job Hub local</h1>
          <p>Cadastre vagas manualmente e acompanhe o grau de compatibilidade de cada persona.</p>
        </div>
        <div>
          <label htmlFor="persona-filter">Compatibilidade por persona</label>
          <select
            id="persona-filter"
            value={selectedPersona}
            onChange={(event) => setSelectedPersona(event.target.value)}
            disabled={!personas.length}
          >
            {personas.length === 0 ? (
              <option>Cadastre personas</option>
            ) : (
              personas.map((persona) => (
                <option key={persona.slug} value={persona.slug}>{persona.nome}</option>
              ))
            )}
          </select>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="form-container">
        <h2>Cadastrar nova vaga</h2>
        <div className="form-grid">
          <input name="titulo" value={formState.titulo} onChange={handleInputChange} placeholder="Título da vaga" required />
          <input name="empresa" value={formState.empresa} onChange={handleInputChange} placeholder="Empresa" required />
          <input name="link" value={formState.link} onChange={handleInputChange} placeholder="Link da vaga" />
          <select name="senioridade" value={formState.senioridade} onChange={handleInputChange}>
            <option>Júnior</option>
            <option>Pleno</option>
            <option>Sênior</option>
          </select>
          <select name="modelo" value={formState.modelo} onChange={handleInputChange}>
            <option>Home office</option>
            <option>Híbrido</option>
            <option>Presencial</option>
          </select>
          <select name="tipoContrato" value={formState.tipoContrato} onChange={handleInputChange}>
            <option>CLT</option>
            <option>PJ</option>
            <option>Freelancer</option>
          </select>
          <input name="focoCarreira" value={formState.focoCarreira} onChange={handleInputChange} placeholder="Foco de carreira" />
          <input name="stackDesejada" value={formState.stackDesejada} onChange={handleInputChange} placeholder="Stack desejada (vírgula)" />
          <input name="valoresCultura" value={formState.valoresCultura} onChange={handleInputChange} placeholder="Valores culturais (vírgula)" />
          <input name="origem" value={formState.origem} onChange={handleInputChange} placeholder="Origem" />
          <input name="status" value={formState.status} onChange={handleInputChange} placeholder="Status" />
        </div>
        <textarea name="descricao" value={formState.descricao} onChange={handleInputChange} placeholder="Resumo da vaga" rows="3" />
        <button type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Adicionar vaga'}</button>
      </form>

      <h2>Vagas cadastradas</h2>
      {isLoading ? (
        <p>Carregando vagas...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Empresa</th>
              <th>Modelo / Contrato</th>
              <th>Compatibilidade</th>
            </tr>
          </thead>
          <tbody>
            {vagas.map((vaga) => {
              const compat = getCompatibilidade(vaga);
              return (
                <tr key={vaga.id}>
                  <td>
                    <strong>{vaga.titulo}</strong>
                    <br />
                    <a href={vaga.link} target="_blank" rel="noreferrer">Ver vaga</a>
                  </td>
                  <td>
                    {vaga.empresa}
                    <br />
                    <small>{vaga.senioridade}</small>
                  </td>
                  <td>
                    {vaga.modelo}
                    <br />
                    <small>{vaga.tipoContrato}</small>
                  </td>
                  <td>
                    {compat ? (
                      <div>
                        <strong>{compat.score}% - {compat.nivel}</strong>
                        <ul>
                          {compat.motivos.slice(0, 2).map((motivo, index) => (
                            <li key={index}>{motivo}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <span className="pill">Sem dados</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VagasPage;
