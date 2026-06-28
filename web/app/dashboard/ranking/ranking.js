const API_BASE_URL = "http://localhost:3000";

// Mantém o UID na navegação interna ao clicar em 'voltar'
function setupBackButton() {
    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.get('uid');
    const backBtn = document.getElementById('btn-back-dashboard');
    
    if (uid) {
        backBtn.href = `/app/dashboard/?uid=${encodeURIComponent(uid)}`;
    } else {
        backBtn.href = "/app/dashboard/";
    }
}

// 1. Carrega os jogos do backend e popula o elemento <select>
async function loadFilterGames() {
    const select = document.getElementById('gameFilter');
    try {
        const response = await fetch(`${API_BASE_URL}/games`);
        if (!response.ok) return;
        
        const games = await response.json();
        
        // Mantém a opção padrão e adiciona os do banco
        select.innerHTML = '<option value="all">Todos os jogos</option>';
        games.forEach(game => {
            const option = document.createElement('option');
            option.value = game.id;
            option.textContent = game.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao listar filtros de jogos:', error);
    }
}

// 2. Busca os dados de ranking (filtrados ou gerais) e atualiza as tabelas HTML
async function loadRankingsData(gameId = 'all') {
    const tableGame = document.getElementById('table-game-rows');
    const tablePlayer = document.getElementById('table-player-rows');

    tableGame.innerHTML = `<tr><td colspan="3" style="text-align:center;">Carregando...</td></tr>`;
    tablePlayer.innerHTML = `<tr><td colspan="3" style="text-align:center;">Carregando...</td></tr>`;

    try {
        const response = await fetch(`${API_BASE_URL}/games/rankings?gameId=${gameId}`);
        if (!response.ok) throw new Error('Falha na resposta do servidor.');

        const data = await response.json();

        // Renderiza Tabela 1 (Por Jogo)
        tableGame.innerHTML = '';
        if (data.byGame.length === 0) {
            tableGame.innerHTML = `<tr><td colspan="3" style="text-align:center;">Sem registros.</td></tr>`;
        } else {
            data.byGame.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${item.gameName}</td>
                    <td>${item.points.toLocaleString('pt-BR')}</td>
                    <td>${item.date}</td>
                `;
                tableGame.appendChild(tr);
            });
        }

        // Renderiza Tabela 2 (Por Jogador)
        tablePlayer.innerHTML = '';
        if (data.byPlayer.length === 0) {
            tablePlayer.innerHTML = `<tr><td colspan="3" style="text-align:center;">Sem registros.</td></tr>`;
        } else {
            data.byPlayer.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${item.playerName}</td>
                    <td>${item.points.toLocaleString('pt-BR')}</td>
                    <td>${item.date}</td>
                `;
                tablePlayer.appendChild(tr);
            });
        }

    } catch (error) {
        console.error('Erro ao renderizar rankings:', error);
        const errorRow = `<tr><td colspan="3" style="text-align:center; color:red;">Erro de carregamento.</td></tr>`;
        tableGame.innerHTML = errorRow;
        tablePlayer.innerHTML = errorRow;
    }
}

// Escuta mudanças de seleção no filtro de jogos
document.getElementById('gameFilter').addEventListener('change', (e) => {
    loadRankingsData(e.target.value);
});

// Inicialização da página
document.addEventListener('DOMContentLoaded', async () => {
    setupBackButton();
    await loadFilterGames();
    await loadRankingsData('all');
});
