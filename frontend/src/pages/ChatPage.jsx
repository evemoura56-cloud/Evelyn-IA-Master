import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { gemsApi } from '../api/gemsApi';
import { chatApi } from '../api/chatApi';
import './ChatPage.css';

const ChatPage = () => {
  // Estados para gerenciar a lógica do chat
  const [personas, setPersonas] = useState([]);
  const [selectedPersona, setSelectedPersona] = useState('');
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  const messageListRef = useRef(null);

  const { personaSlug } = useParams();

  // Efeito para buscar as personas quando o componente é montado
  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const response = await gemsApi.getGems();
        const data = response?.data;
        const parsedPersonas = Array.isArray(data) ? data : data?.data || [];
        setPersonas(parsedPersonas);
        setSelectedPersona((current) => {
          if (personaSlug) {
            const personaExists = parsedPersonas.some((persona) => persona.slug === personaSlug);
            if (personaExists) {
              return personaSlug;
            }
          }
          if (current) {
            return current;
          }
          return parsedPersonas[0]?.slug || '';
        });
      } catch (error) {
        console.error('Falha ao carregar personas.', error);
      }
    };
    fetchPersonas();
  }, [personaSlug]);

  // Efeito para rolar para a última mensagem
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  // Função para lidar com o envio de mensagens
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || !selectedPersona || isLoading) return;

    const userMessage = { sender: 'user', text: userInput };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await chatApi.sendMessage(selectedPersona, userInput, conversationId);
      const responseData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;

      const assistantMessage = { sender: 'assistant', text: responseData.assistantMessage };
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
      setConversationId(responseData.conversationId);

    } catch (error) {
      const errorMessage = { sender: 'assistant', text: 'Desculpe, ocorreu um erro ao processar sua mensagem.' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Reseta o chat ao mudar de persona
  const handlePersonaChange = (e) => {
    setSelectedPersona(e.target.value);
    setMessages([]);
    setConversationId(null);
  };

  const personaSelecionada = useMemo(() => personas.find((persona) => persona.slug === selectedPersona), [personas, selectedPersona]);

  return (
    <div className="chat-page-container">
      <aside className="persona-selector">
        <h2 className="persona-selector-title">Personas locais</h2>
        <select className="persona-select" value={selectedPersona} onChange={handlePersonaChange}>
          <option value="">Selecione uma persona</option>
          {personas.map(persona => (
            <option key={persona.slug} value={persona.slug}>
              {persona.nome || persona.name || persona.slug}
            </option>
          ))}
        </select>
        {personaSelecionada ? (
          <div className="persona-details">
            <h3>{personaSelecionada.nome}</h3>
            <p>{personaSelecionada.descricao}</p>
            <div className="persona-tags">
              <span className="pill">{personaSelecionada.personalidade}</span>
              <span className="pill">Tom: {personaSelecionada.tom}</span>
              <span className="pill">Foco: {personaSelecionada.focoCarreira}</span>
            </div>
            <small>Instruções: {personaSelecionada.instrucoes}</small>
          </div>
        ) : (
          <p className="persona-description">
            Selecione uma das suas personas criadas na Evelyn Mater. Tudo acontece localmente, sem API externa.
          </p>
        )}
      </aside>

      <main className="chat-window">
        <div className="message-list" ref={messageListRef}>
          {messages.length === 0 && (
            <div className="message assistant">
                <p>{personaSelecionada ? `Olá! Você está falando com ${personaSelecionada.nome}. Envie sua primeira mensagem!` : 'Olá! Por favor, selecione uma persona para começar a conversar.'}</p>
            </div>
          )}
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              <p>{msg.text}</p>
            </div>
          ))}
          {isLoading && (
            <div className="message assistant">
              <p><i>Digitando...</i></p>
            </div>
          )}
        </div>
        <form className="message-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="message-input"
            placeholder={selectedPersona ? "Digite sua mensagem..." : "Selecione uma persona para começar"}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={!selectedPersona || isLoading}
          />
          <button type="submit" className="send-button" disabled={!selectedPersona || isLoading}>
            Enviar
          </button>
        </form>
      </main>
    </div>
  );
};

export default ChatPage;
