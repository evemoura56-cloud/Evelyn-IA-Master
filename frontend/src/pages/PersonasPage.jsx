import React, { useEffect, useMemo, useState } from 'react';
import { gemsApi } from '../api/gemsApi';
import './../styles/forms.css';
import './../styles/tables.css';
import './../styles/modules.css';

const emptyForm = {
  nome: '',
  descricao: '',
  instrucoes: '',
  personalidade: '',
  tom: 'Profissional e direto',
  especialidades: '',
  focoCarreira: '',
  senioridadePreferida: 'Pleno',
  valores: '',
  interesses: ''
};

const PersonasPage = () => {
  const [personas, setPersonas] = useState([]);
  const [formState, setFormState] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  const maxPersonas = useMemo(() => gemsApi.MAX_PERSONAS, []);

  const loadPersonas = async () => {
    setIsLoading(true);
    const response = await gemsApi.getGems();
    setPersonas(response.data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadPersonas();
  }, []);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await gemsApi.createGem(formState);
      setFeedback({ type: 'success', message: 'Persona adicionada com sucesso!' });
      setFormState(emptyForm);
      loadPersonas();
    } catch (error) {
      setFeedback({ type: 'error', message: error.message || 'Não foi possível adicionar a persona.' });
    }
  };

  return (
    <div className="personas-page">
      <header className="page-header">
        <div>
          <h1>Personas da Evelyn Mater</h1>
          <p>Monte até {maxPersonas} personas diferentes com nome, tom, instruções e foco.</p>
        </div>
        <div className="stat-card">
          <span>Total criado</span>
          <strong>{personas.length}/{maxPersonas}</strong>
        </div>
      </header>

      <section className="cards-grid">
        {isLoading ? (
          <p>Carregando personas...</p>
        ) : personas.length === 0 ? (
          <p>Nenhuma persona cadastrada ainda.</p>
        ) : (
          personas.map((persona) => (
            <article className="persona-card" key={persona.id}>
              <header>
                <h3>{persona.nome}</h3>
                <small>/{persona.slug}</small>
              </header>
              <p className="persona-description">{persona.descricao}</p>
              <div className="chips-row">
                <span className="pill">{persona.personalidade}</span>
                <span className="pill">Tom: {persona.tom}</span>
                <span className="pill">Foco: {persona.focoCarreira}</span>
                <span className="pill">Senioridade: {persona.senioridadePreferida}</span>
              </div>
              <div className="persona-meta">
                <strong>Instruções</strong>
                <p>{persona.instrucoes}</p>
              </div>
              <div className="persona-meta">
                <strong>Especialidades</strong>
                <p>{persona.especialidades.join(', ')}</p>
              </div>
              <div className="persona-meta">
                <strong>Valores e interesses</strong>
                <p>{persona.valores.join(', ')} | {persona.interesses.join(', ')}</p>
              </div>
            </article>
          ))
        )}
      </section>

      <form className="form-container" onSubmit={handleSubmit}>
        <h2>Adicionar nova persona</h2>
        <p>Use vírgula para separar listas (especialidades, valores, interesses). Campos obrigatórios garantem que o chat e o preenchedor terão contexto suficiente.</p>
        {feedback && (
          <div className={`feedback ${feedback.type}`}>
            {feedback.message}
          </div>
        )}
        <input name="nome" placeholder="Nome" value={formState.nome} onChange={handleInput} required />
        <textarea name="descricao" placeholder="Descrição curta" value={formState.descricao} onChange={handleInput} rows="2" required />
        <textarea name="instrucoes" placeholder="Instruções (SYSTEM PROMPT)" value={formState.instrucoes} onChange={handleInput} rows="3" required />
        <input name="personalidade" placeholder="Personalidade" value={formState.personalidade} onChange={handleInput} required />
        <select name="tom" value={formState.tom} onChange={handleInput}>
          <option>Profissional e direto</option>
          <option>Casual técnico</option>
          <option>Inspirador</option>
        </select>
        <input name="especialidades" placeholder="Especialidades (separadas por vírgula)" value={formState.especialidades} onChange={handleInput} required />
        <input name="focoCarreira" placeholder="Foco de carreira" value={formState.focoCarreira} onChange={handleInput} required />
        <select name="senioridadePreferida" value={formState.senioridadePreferida} onChange={handleInput}>
          <option>Júnior</option>
          <option>Pleno</option>
          <option>Sênior</option>
        </select>
        <input name="valores" placeholder="Valores (separados por vírgula)" value={formState.valores} onChange={handleInput} required />
        <input name="interesses" placeholder="Interesses (separados por vírgula)" value={formState.interesses} onChange={handleInput} required />
        <button type="submit" disabled={personas.length >= maxPersonas}>Salvar persona</button>
        {personas.length >= maxPersonas && (
          <small>Limite máximo atingido. Edite ou remova alguma persona direto no banco local (localStorage) para abrir espaço.</small>
        )}
      </form>
    </div>
  );
};

export default PersonasPage;
