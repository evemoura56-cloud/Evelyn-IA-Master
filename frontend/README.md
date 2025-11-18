# Evelyn Mater – Frontend local

SPA construída com React + Vite para centralizar personas, chat e gestão de vagas sem qualquer dependência externa.

## Scripts disponíveis

```bash
npm install        # instala dependências
npm run dev        # inicia em modo desenvolvimento (http://localhost:5173)
npm run build      # gera a pasta dist para deploy estático
npm run preview    # simula produção
```

## Estrutura

- `src/data/defaultState.js` – dados iniciais.
- `src/services/localDatabase.js` – CRUD em cima do `localStorage`.
- `src/api/*.js` – camada fina que conversa com o banco local (mantém a mesma interface de uma API HTTP).
- `src/pages` – telas (Dashboard, Personas, Chat, Vagas, Links, Candidaturas e Preenchedor).

## Customizações rápidas

- **Resetar dados**: `localStorage.removeItem('evelyn-ia-master:db')` no console do navegador.
- **Editar respostas do chat**: função `simulateChatResponse` em `localDatabase.js`.
- **Modificar cálculo de compatibilidade**: função `calculateCompatibility` no mesmo arquivo.

Sinta-se à vontade para adaptar o layout e incluir novas métricas – tudo já está pronto para funcionar offline.
