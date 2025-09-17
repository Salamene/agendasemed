class AgendaColaborativa {
    constructor() {
        this.apiUrl = '/api/tarefas';
        this.tarefas = [];
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.setDefaultDateTime();
        await this.carregarTarefas();
        this.atualizarEstatisticas();
        
        // Atualizar automaticamente a cada 30 segundos
        setInterval(() => {
            this.carregarTarefas();
        }, 30000);
    }

    setupEventListeners() {
        const form = document.getElementById('taskForm');
        form.addEventListener('submit', (e) => this.adicionarTarefa(e));
    }

    setDefaultDateTime() {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        document.getElementById('taskTime').value = now.toISOString().slice(0, 16);
    }

    async carregarTarefas() {
        try {
            const response = await fetch(this.apiUrl);
            if (!response.ok) throw new Error('Erro ao carregar tarefas');
            
            this.tarefas = await response.json();
            this.renderizarTarefas();
            this.atualizarEstatisticas();
        } catch (error) {
            console.error('Erro:', error);
            this.mostrarNotificacao('Erro ao carregar tarefas', 'error');
        }
    }

    async adicionarTarefa(e) {
        e.preventDefault();
        
        const nome = document.getElementById('taskName').value.trim();
        const descricao = document.getElementById('taskDescription').value.trim();
        const horario = document.getElementById('taskTime').value;

        if (!nome || !descricao || !horario) {
            this.mostrarNotificacao('Preencha todos os campos', 'error');
            return;
        }

        const novaTarefa = { nome, descricao, horario };

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(novaTarefa)
            });

            if (!response.ok) throw new Error('Erro ao adicionar tarefa');

            const tarefaAdicionada = await response.json();
            this.tarefas.push(tarefaAdicionada);
            
            this.renderizarTarefas();
            this.atualizarEstatisticas();
            this.limparFormulario();
            this.mostrarNotificacao('Tarefa adicionada com sucesso!', 'success');
            
        } catch (error) {
            console.error('Erro:', error);
            this.mostrarNotificacao('Erro ao adicionar tarefa', 'error');
        }
    }

    async removerTarefa(id) {
        if (!confirm('Tem certeza que deseja remover esta tarefa?')) return;

        try {
            const response = await fetch(`${this.apiUrl}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Erro ao remover tarefa');

            this.tarefas = this.tarefas.filter(t => t.id !== id);
            this.renderizarTarefas();
            this.atualizarEstatisticas();
            this.mostrarNotificacao('Tarefa removida com sucesso!', 'success');
            
        } catch (error) {
            console.error('Erro:', error);
            this.mostrarNotificacao('Erro ao remover tarefa', 'error');
        }
    }

    renderizarTarefas() {
        const container = document.getElementById('tasksContainer');
        
        if (this.tarefas.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-plus"></i>
                    <h3>Nenhuma tarefa encontrada</h3>
                    <p>Adicione sua primeira tarefa para começar!</p>
                </div>
            `;
            return;
        }

        // Ordenar tarefas por horário
        const tarefasOrdenadas = [...this.tarefas].sort((a, b) => 
            new Date(a.horario) - new Date(b.horario)
        );

        container.innerHTML = tarefasOrdenadas.map(tarefa => 
            this.criarCardTarefa(tarefa)
        ).join('');

        // Adicionar event listeners para os botões de remover
        container.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('.delete-btn').dataset.id);
                this.removerTarefa(id);
            });
        });
    }

    criarCardTarefa(tarefa) {
        const dataHorario = new Date(tarefa.horario);
        const dataCriacao = new Date(tarefa.criadoEm);
        const agora = new Date();
        
        const horarioFormatado = dataHorario.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const criadoFormatado = dataCriacao.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Determinar se a tarefa é urgente (próximas 2 horas)
        const isUrgente = dataHorario - agora < 2 * 60 * 60 * 1000 && dataHorario > agora;
        const isPendente = dataHorario < agora;

        let statusClass = '';
        let statusIcon = 'fas fa-clock';
        
        if (isPendente) {
            statusClass = 'style="background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);"';
            statusIcon = 'fas fa-exclamation-triangle';
        } else if (isUrgente) {
            statusClass = 'style="background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);"';
            statusIcon = 'fas fa-fire';
        }

        return `
            <div class="task-card">
                <div class="task-header">
                    <div>
                        <div class="task-name">${this.escapeHtml(tarefa.nome)}</div>
                    </div>
                    <div class="task-time" ${statusClass}>
                        <i class="${statusIcon}"></i>
                        ${horarioFormatado}
                    </div>
                </div>
                
                <div class="task-description">
                    ${this.escapeHtml(tarefa.descricao)}
                </div>
                
                <div class="task-footer">
                    <div class="task-created">
                        <i class="fas fa-plus-circle"></i>
                        Criado em ${criadoFormatado}
                    </div>
                    <button class="delete-btn" data-id="${tarefa.id}">
                        <i class="fas fa-trash"></i>
                        Remover
                    </button>
                </div>
            </div>
        `;
    }

    atualizarEstatisticas() {
        const agora = new Date();
        const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
        const amanha = new Date(hoje);
        amanha.setDate(amanha.getDate() + 1);

        const totalTarefas = this.tarefas.length;
        const tarefasHoje = this.tarefas.filter(t => {
            const dataTarefa = new Date(t.horario);
            return dataTarefa >= hoje && dataTarefa < amanha;
        }).length;

        const tarefasProximas = this.tarefas.filter(t => {
            const dataTarefa = new Date(t.horario);
            return dataTarefa > agora;
        }).length;

        document.getElementById('totalTasks').textContent = totalTarefas;
        document.getElementById('todayTasks').textContent = tarefasHoje;
        document.getElementById('upcomingTasks').textContent = tarefasProximas;
    }

    limparFormulario() {
        document.getElementById('taskForm').reset();
        this.setDefaultDateTime();
    }

    mostrarNotificacao(mensagem, tipo = 'success') {
        const notification = document.getElementById('notification');
        notification.textContent = mensagem;
        notification.className = `notification ${tipo}`;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new AgendaColaborativa();
});

// Service Worker para cache (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registrado com sucesso:', registration);
            })
            .catch(registrationError => {
                console.log('Falha no registro do SW:', registrationError);
            });
    });
}

