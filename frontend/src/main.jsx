import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';
import './styles/layout.css'; // Importação global de estilos
import './styles/modules.css';

import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import PersonasPage from './pages/PersonasPage';
import ChatPage from './pages/ChatPage';
import VagasPage from './pages/VagasPage';
import LinksPage from './pages/LinksPage';
import CandidaturasPage from './pages/CandidaturasPage';
import PreenchedorPage from './pages/PreenchedorPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "personas", element: <PersonasPage /> },
      { path: "chat", element: <ChatPage /> },
      { path: "chat/:personaSlug", element: <ChatPage /> }, // Rota para persona específica
      { path: "vagas", element: <VagasPage /> },
      { path: "links", element: <LinksPage /> },
      { path: "candidaturas", element: <CandidaturasPage /> },
      { path: "preenchedor", element: <PreenchedorPage /> },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
