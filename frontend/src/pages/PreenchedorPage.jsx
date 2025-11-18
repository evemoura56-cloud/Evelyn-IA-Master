import React, { useState, useEffect } from 'react';
import { gemsApi } from '../api/gemsApi';
import { preenchedorApi } from '../api/preenchedorApi';
import './../styles/forms.css';

const PreenchedorPage = () => {
  const [personas, setPersonas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState({
    personaSlug: '',
    dadosVaga: '',
    perfilCandidata: '',
    tom: 'profissional e direto'
  });
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    gemsApi.getGems().then(response => {
      setPersonas(response.data);
      if (response.data.length) {
        setFormState(prev => ({ ...prev, personaSlug: response.data[0].slug }));
      }
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResultado(null);
    try {
      const response = await preenchedorApi.gerarTexto(formState);
      setResultado(response.data);
    } catch (error) {
      alert('Erro ao gerar texto: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Robô Preenchedor de Vagas</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <select name="personaSlug" value={formState.personaSlug} onChange={handleInputChange}>
          {personas.map(p => <option key={p.slug} value={p.slug}>{p.nome}</option>)}
        </select>
        <textarea name="dadosVaga" value={formState.dadosVaga} onChange={handleInputChange} placeholder="Cole a descrição da vaga aqui..." rows="10" required />
        <textarea name="perfilCandidata" value={formState.perfilCandidata} onChange={handleInputChange} placeholder="Cole um resumo do seu perfil ou currículo..." rows="5" required />
        <select name="tom" value={formState.tom} onChange={handleInputChange}>
          <option>Profissional e direto</option>
          <option>Leve e humano</option>
          <option>Criativo e ousado</option>
        </select>
        <button type="submit" disabled={isLoading}>{isLoading ? 'Gerando...' : 'Gerar Texto'}</button>
      </form>

      {resultado && (
        <div className="resultado-preenchedor">
          <h2>Texto Gerado</h2>
          <h3>Mensagem para o Recrutador:</h3>
          <p>{resultado.mensagemParaRecrutador}</p>
          <h3>Resumo Personalizado:</h3>
          <p>{resultado.resumoPersonalizado}</p>
          <h3>Motivos para Contratação:</h3>
          <ul>
            {resultado.bulletsMotivos.map((motivo, i) => <li key={i}>{motivo}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PreenchedorPage;
