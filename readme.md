# 🧠 Dev Logger

Automatize o registro de atividades diárias como desenvolvedor a partir dos commits feitos no GitHub — sincronizando com uma planilha do Google Sheets.

## ✨ Funcionalidades

- Busca automática de commits do mês atual
- Preenchimento de planilha com:
  - Dia da semana
  - Data
  - Horário de entrada e saída
  - Descrição baseada em mensagens de commit, com hora e repositório
- Suporte a múltiplos repositórios
- Registro diário, mesmo quando não houver commits

---

## 🚀 Tecnologias

- Node.js + TypeScript
- Google Sheets API
- GitHub REST API (via Octokit)
- dotenv para configuração de ambiente
- ts-node para execução direta

---

## ⚙️ Instalação

```bash
git clone https://github.com/gabrielLAraujo/dev-logger.git
cd dev-logger
npm install
