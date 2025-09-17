# 📅 Sistema de Agenda Colaborativa

Um sistema moderno e elegante para gerenciar tarefas em equipe, desenvolvido com Node.js, Express e JavaScript puro.

## ✨ Características

- **Design Moderno**: Interface elegante com gradientes e animações suaves
- **Responsivo**: Funciona perfeitamente em desktop e mobile
- **Tempo Real**: Atualizações automáticas a cada 30 segundos
- **Estatísticas**: Visualização de tarefas totais, do dia e próximas
- **Funcionalidades Completas**: Adicionar, visualizar e remover tarefas
- **Armazenamento JSON**: Dados persistidos em arquivo local
- **Notificações**: Feedback visual para todas as ações

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm (geralmente vem com o Node.js)

### Instalação

1. **Clone ou baixe o projeto**
   ```bash
   # Se usando git
   git clone <url-do-repositorio>
   cd agenda-colaborativa
   
   # Ou extraia os arquivos baixados
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute o servidor**
   ```bash
   npm start
   # ou
   node server.js
   ```

4. **Acesse a aplicação**
   - Abra seu navegador
   - Vá para: `http://localhost:3000`

## 📁 Estrutura do Projeto

```
agenda-colaborativa/
├── server.js              # Servidor Node.js/Express
├── package.json           # Configurações do projeto
├── public/                # Arquivos do front-end
│   ├── index.html        # Interface principal
│   ├── script.js         # Lógica JavaScript
│   ├── sw.js             # Service Worker (cache)
│   └── agenda.json       # Banco de dados JSON
└── README.md             # Este arquivo
```

## 🎯 Funcionalidades

### ✅ Implementadas
- [x] Visualizar todas as tarefas
- [x] Adicionar nova tarefa (nome, descrição, horário)
- [x] Remover tarefas existentes
- [x] Estatísticas em tempo real
- [x] Interface responsiva
- [x] Notificações de sucesso/erro
- [x] Atualização automática
- [x] Cache offline (Service Worker)

### 🔮 Possíveis Melhorias Futuras
- [ ] Editar tarefas existentes
- [ ] Filtros por data/status
- [ ] Categorias de tarefas
- [ ] Múltiplos usuários com autenticação
- [ ] Notificações push
- [ ] Exportar dados

## 🛠️ Tecnologias Utilizadas

- **Backend**: Node.js, Express.js, CORS
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Armazenamento**: JSON file
- **Fontes**: Google Fonts (Inter)
- **Ícones**: Font Awesome
- **Cache**: Service Worker

## 📱 Compatibilidade

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 🎨 Design

O sistema utiliza um design moderno com:
- Gradiente roxo elegante
- Cards com glassmorphism
- Animações suaves
- Tipografia Inter
- Ícones Font Awesome
- Layout responsivo

## 🔧 Configuração

### Porta do Servidor
Para alterar a porta (padrão: 3000), edite o arquivo `server.js`:
```javascript
const PORT = 3000; // Altere aqui
```

### Dados Iniciais
O arquivo `public/agenda.json` contém dados de exemplo. Você pode:
- Manter os dados de exemplo
- Limpar o arquivo deixando apenas: `{"tarefas": []}`
- Adicionar suas próprias tarefas iniciais

## 🐛 Solução de Problemas

### Erro "Port already in use"
```bash
# Encontre o processo usando a porta
lsof -i :3000
# Mate o processo
kill -9 <PID>
```

### Erro de permissão
```bash
# No Linux/Mac, use sudo se necessário
sudo npm start
```

### Dependências não instaladas
```bash
# Reinstale as dependências
rm -rf node_modules package-lock.json
npm install
```

## 📄 Licença

Este projeto é de código aberto e pode ser usado livremente para fins educacionais e comerciais.

## 👨‍💻 Desenvolvimento

Desenvolvido com ❤️ usando tecnologias modernas e boas práticas de desenvolvimento web.

---

**Aproveite sua nova agenda colaborativa! 🎉**

