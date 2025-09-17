const express = require(\'express\');
const cors = require(\'cors\');
const fs = require(\'fs\').promises;
const path = require(\'path\');

const app = express();
const PORT = process.env.PORT || 3000; // Usa a porta do ambiente ou 3000 como padrão
const AGENDA_FILE = path.join(__dirname, \'public\', \'agenda.json\');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(\'public\')); // Servir arquivos estáticos da pasta public

// Função para ler o arquivo JSON
async function lerAgenda() {
    try {
        const data = await fs.readFile(AGENDA_FILE, \'utf8\');
        return JSON.parse(data);
    } catch (error) {
        console.error(\'Erro ao ler agenda:\', error);
        // Se o arquivo não existir, retorna um objeto vazio para evitar erros
        if (error.code === \'ENOENT\') {
            return { tarefas: [] };
        }
        throw error; // Re-lança outros erros
    }
}

// Função para escrever no arquivo JSON
async function salvarAgenda(agenda) {
    try {
        await fs.writeFile(AGENDA_FILE, JSON.stringify(agenda, null, 2));
        return true;
    } catch (error) {
        console.error(\'Erro ao salvar agenda:\', error);
        return false;
    }
}

// Rota para obter todas as tarefas
app.get(\'/api/tarefas\', async (req, res) => {
    try {
        const agenda = await lerAgenda();
        res.json(agenda.tarefas);
    } catch (error) {
        res.status(500).json({ erro: \'Erro interno do servidor\' });
    }
});

// Rota para adicionar nova tarefa
app.post(\'/api/tarefas\', async (req, res) => {
    try {
        const { nome, descricao, horario } = req.body;
        
        // Validação básica
        if (!nome || !descricao || !horario) {
            return res.status(400).json({ erro: \'Nome, descrição e horário são obrigatórios\' });
        }

        const agenda = await lerAgenda();
        
        // Gerar novo ID
        const novoId = agenda.tarefas.length > 0 
            ? Math.max(...agenda.tarefas.map(t => t.id)) + 1 
            : 1;

        const novaTarefa = {
            id: novoId,
            nome,
            descricao,
            horario,
            criadoEm: new Date().toISOString()
        };

        agenda.tarefas.push(novaTarefa);
        
        const sucesso = await salvarAgenda(agenda);
        
        if (sucesso) {
            res.status(201).json(novaTarefa);
        } else {
            res.status(500).json({ erro: \'Erro ao salvar tarefa\' });
        }
    } catch (error) {
        console.error(\'Erro ao adicionar tarefa:\', error);
        res.status(500).json({ erro: \'Erro interno do servidor\' });
    }
});

// Rota para deletar tarefa
app.delete(\'/api/tarefas/:id\', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const agenda = await lerAgenda();
        
        const indice = agenda.tarefas.findIndex(t => t.id === id);
        
        if (indice === -1) {
            return res.status(404).json({ erro: \'Tarefa não encontrada\' });
        }

        agenda.tarefas.splice(indice, 1);
        
        const sucesso = await salvarAgenda(agenda);
        
        if (sucesso) {
            res.json({ mensagem: \'Tarefa removida com sucesso\' });
        } else {
            res.status(500).json({ erro: \'Erro ao remover tarefa\' });
        }
    } catch (error) {
        console.error(\'Erro ao remover tarefa:\', error);
        res.status(500).json({ erro: \'Erro interno do servidor\' });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📅 Sistema de Agenda Colaborativa iniciado!`);
});


