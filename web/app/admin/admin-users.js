const API_BASE_URL = "http://localhost:3000";

async function loadAdminUsers() {
    const tbody = document.getElementById('admin-users-rows');
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Carregando usuários...</td></tr>`;

    try {
        const response = await fetch(`${API_BASE_URL}/cards/admin/list`);
        if (!response.ok) throw new Error('Erro ao buscar dados do servidor.');

        const users = await response.json();
        tbody.innerHTML = '';

        if (users.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Nenhum usuário cadastrado.</td></tr>`;
            return;
        }

        users.forEach(user => {
            const tr = document.createElement('tr');
            const userName = user.name || 'Sem nome cadastrado';
            
            tr.innerHTML = `
                <td>${userName}</td>
                <td>${user.createdAt}</td>
                <td><code>${user.uid}</code></td>
                <td>${user.balance}</td>
                <td>
                    <button type="button" 
                            class="credits-buy-btn btn btn-sm btn-outline-info" 
                            data-bs-toggle="modal" 
                            data-bs-target="#modalHist" 
                            data-id="${user.id}" 
                            data-name="${userName}">
                        Histórico
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error(error);
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">Erro ao carregar o painel.</td></tr>`;
    }
}

// Intercepta a exibição do modal do Bootstrap para injetar os dados de forma assíncrona
const modalElement = document.getElementById('modalHist');
if (modalElement) {
    modalElement.addEventListener('show.bs.modal', async (event) => {
        const button = event.relatedTarget; // Botão que disparou o modal
        const cardId = button.getAttribute('data-id');
        const userName = button.getAttribute('data-name');

        // Atualiza títulos do cabeçalho do Modal
        document.getElementById('modal-user-name').textContent = `Histórico - ${userName}`;
        
        const historyTableBody = document.getElementById('modal-history-rows');
        historyTableBody.innerHTML = `<tr><td colspan="3" style="text-align:center;">Buscando registros...</td></tr>`;

        try {
            const response = await fetch(`${API_BASE_URL}/cards/admin/${cardId}/history`);
            if (!response.ok) throw new Error();

            const items = await response.json();
            historyTableBody.innerHTML = '';

            if (items.length === 0) {
                historyTableBody.innerHTML = `<tr><td colspan="3" style="text-align:center;">Nenhuma partida recente encontrada.</td></tr>`;
                return;
            }

            items.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${item.gameName}</td>
                    <td>${item.points}</td>
                    <td style="color: #ff5252; font-weight: bold;">${item.creditsUsed}</td>
                `;
                historyTableBody.appendChild(tr);
            });

        } catch (error) {
            historyTableBody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:red;">Erro ao buscar histórico.</td></tr>`;
        }
    });
}

// Inicializa a carga dos dados administrativos
document.addEventListener('DOMContentLoaded', loadAdminUsers);
