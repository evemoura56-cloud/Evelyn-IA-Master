import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './../styles/layout.css';
import { gemsApi } from '../api/gemsApi';

const Sidebar = () => {
  const [personas, setPersonas] = useState([]);

  useEffect(() => {
    const loadPersonas = async () => {
      const response = await gemsApi.getGems();
      setPersonas(response.data);
    };
    loadPersonas();
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Evelyn Mater</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" className="nav-item">Dashboard</NavLink>
        <NavLink to="/personas" className="nav-item">Personas</NavLink>
        <NavLink to="/chat" className="nav-item">Chat</NavLink>
        <NavLink to="/vagas" className="nav-item">Vagas</NavLink>
        <NavLink to="/links" className="nav-item">Links Pré-preenchidos</NavLink>
        <NavLink to="/candidaturas" className="nav-item">Candidaturas</NavLink>
        <NavLink to="/preenchedor" className="nav-item">Preenchedor</NavLink>
      </nav>
      <div className="sidebar-gems">
        <h3>Personas (até 7)</h3>
        {personas.map((persona) => (
          <NavLink key={persona.slug} to={`/chat/${persona.slug}`} className="gem-link">
            {persona.nome}
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
