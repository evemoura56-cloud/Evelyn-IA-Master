import React, { useState, useEffect } from 'react';
import { vagasApi } from '../api/vagasApi';
import './../styles/forms.css';
import './../styles/tables.css';

const VagasPage = () => {
  const [vagas, setVagas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formState, setFormState] = useState({
    titulo: '',
    empresa: '',
    link: '',
    senioridade: 'Pleno',
    modelo: 'Home office'
  });

  useEffect(() => {
    fetchVagas();
  }, []);

  const fetchVagas = () => {
    setIsLoading(true);
    vagasApi.getVagas()
      .then(response => {
        setVagas(response.data);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    vagasApi.createVaga(formState)
      .then(() => {
        fetchVagas(); // Recarrega a lista
        // Limpa o formulário
        setFormState({ titulo: '', empresa: '', link: '', senioridade: 'Pleno', modelo: 'Home office' });
      })
      .catch(error => {
        alert('Erro ao criar vaga: ' + error.message);
      });
  };

  return (
    <div className="vagas-page">
      <h1>Job Hub - Vagas</h1>

      <form onSubmit={handleSubmit} className="form-container">
        <h2>Cadastrar Nova Vaga</h2>
        <input name="titulo" value={formState.titulo} onChange={handleInputChange} placeholder="Título da Vaga" required />
        <input name="empresa" value={formState.empresa} onChange={handleInputChange} placeholder="Empresa" required />
        <input name="link" value={formState.link} onChange={handleInputChange} placeholder="Link da Vaga" />
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
        <button type="submit">Adicionar Vaga</button>
      </form>

      <h2>Vagas Cadastradas</h2>
      {isLoading ? (
        <p>Carregando vagas...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Empresa</th>
              <th>Senioridade</th>
              <th>Modelo</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {vagas.map(vaga => (
              <tr key={vaga.ID}>
                <td><a href={vaga.LINK_VAGA} target="_blank" rel="noopener noreferrer">{vaga.TITULO_VAGA}</a></td>
                <td>{vaga.EMPRESA}</td>
                <td>{vaga.SENIORIDADE}</td>
                <td>{vaga.MODELO}</td>
                <td>{vaga.STATUS}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VagasPage;
