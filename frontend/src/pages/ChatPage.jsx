import React, { useState, useEffect, useRef } from 'react';
import { getGems, postChatMessage } from '../api/api';
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

  // Efeito para buscar as personas quando o componente é montado
  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const activeGems = await getGems();
        setPersonas(activeGems.data || []); // Garante que temos um array
      } catch (error) {
        console.error("Falha ao carregar personas.", error);
        // Adicionar uma mensagem de erro na UI seria uma boa melhoria
      }
    };
    fetchPersonas();
  }, []);

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
      const response = await postChatMessage({
        personaSlug: selectedPersona,
        userMessage: userInput,
        conversationId: conversationId,
      });

      const assistantMessage = { sender: 'assistant', text: response.assistantMessage };
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
      setConversationId(response.conversationId);

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

  return (
    <div className="chat-page-container">
      <aside className="persona-selector">
        <h2 className="persona-selector-title">Personas (GEMS)</h2>
        <select className="persona-select" value={selectedPersona} onChange={handlePersonaChange}>
          <option value="">Selecione uma persona</option>
          {personas.map(persona => (
            <option key={persona.slug} value={persona.slug}>
              {persona.nome}
            </option>
          ))}
        </select>
        <p className="persona-description">
          Selecione uma das suas GEMS para iniciar uma conversa. A resposta da IA será baseada no "SYSTEM_PROMPT" que você configurou na planilha.
        </p>
      </aside>

      <main className="chat-window">
        <div className="message-list" ref={messageListRef}>
          {messages.length === 0 && (
            <div className="message assistant">
                <p>Olá! Por favor, selecione uma persona para começar a conversar.</p>
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
