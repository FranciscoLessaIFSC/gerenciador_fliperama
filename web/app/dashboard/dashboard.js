const API_BASE_URL = 'http://localhost:3000'

function getCardUid() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('uid')
}

function getCardUid() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('uid') || localStorage.getItem('card_uid');
}

function setupDashboardLinks(uid) {
    if (!uid) return;

    const queryString = `?uid=${encodeURIComponent(uid)}`;

    // 1. Atualiza o link da página de Ranking
    const rankingLink = document.getElementById('btn-ranking-link');
    if (rankingLink) {
        rankingLink.href = `/app/dashboard/ranking/${queryString}`;
    }

    // 2. Atualiza o link da página de Compra de Créditos
    const buyCreditsLink = document.getElementById('btn-buy-credits-link');
    if (buyCreditsLink) {
        buyCreditsLink.href = `../credits.html${queryString}`;
    }
}

async function loadDashboardData() {
    const uid = getCardUid();

    setupDashboardLinks(uid)
    
    try {
        const response = await fetch(`${API_BASE_URL}/cards/${uid}`);
        
        if (!response.ok) {
            throw new Error('Não foi possível carregar os dados do cartão.');
        }

        const data = await response.json();

        // 1. Atualiza os cards de estatísticas (Score e Saldo)
        document.getElementById('card-score').textContent = Number(data.totalScore).toLocaleString('pt-BR');
        document.getElementById('card-balance').textContent = Math.floor(Number(data.balance));

        // 2. Atualiza a tabela com os últimos 5 jogos
        const tbody = document.getElementById('games-history-rows');
        tbody.innerHTML = ''; // Limpa o carregando/antigo

        if (data.recentGames.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;">Nenhum jogo registrado ainda.</td></tr>`;
            return;
        }

        data.recentGames.forEach(game => {
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td>${game.gameName}</td>
                <td>${game.points.toLocaleString('pt-BR')}</td>
                <td>${game.date}</td>
            `;
            
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error('Erro na integração:', error);
        document.getElementById('games-history-rows').innerHTML = 
            `<tr><td colspan="3" style="text-align:center; color:red;">Erro ao carregar dados.</td></tr>`;
    }
}

// Inicializa a carga dos dados assim que a página estiver pronta
document.addEventListener('DOMContentLoaded', loadDashboardData);
