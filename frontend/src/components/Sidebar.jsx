import React from 'react';
import { NavLink } from 'react-router-dom';
import './../styles/layout.css';

const Sidebar = () => {
  // No futuro, esta lista virá da API
  const gems = [
    { name: 'Evelyn PRO – Vagas', slug: 'evelyn_pro_vagas' },
    { name: 'Codex DEV', slug: 'codex_dev' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Evelyn GEMS Hub</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" className="nav-item">Dashboard</NavLink>
        <NavLink to="/chat" className="nav-item">Chat</NavLink>
        <NavLink to="/vagas" className="nav-item">Vagas</NavLink>
        <NavLink to="/candidaturas" className="nav-item">Candidaturas</NavLink>
        <NavLink to="/preenchedor" className="nav-item">Preenchedor</NavLink>
      </nav>
      <div className="sidebar-gems">
        <h3>Personas (GEMS)</h3>
        {gems.map(gem => (
          <NavLink key={gem.slug} to={`/chat/${gem.slug}`} className="gem-link">
            {gem.name}
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
