import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import './../styles/layout.css';

const Layout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {/* O Topbar pode ser adicionado aqui se necessário */}
        <div className="page-content">
          <Outlet /> {/* As páginas serão renderizadas aqui */}
        </div>
      </main>
    </div>
  );
};

export default Layout;
