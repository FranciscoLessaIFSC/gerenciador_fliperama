const API_BASE_URL = "http://localhost:3000";

function getCardUid() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('uid') || localStorage.getItem('card_uid');
}

// Configura o link de retorno mantendo o UID na URL
function setupNavigation() {
    const uid = getCardUid();
    const backBtn = document.getElementById('btn-back-dashboard');
    if (backBtn) {
        backBtn.href = uid ? `/app/dashboard/?uid=${encodeURIComponent(uid)}` : "/app/dashboard/";
    }
}

// Executa a requisição de compra de créditos (Ação: Comprar)
async function handleBuyCredits(event) {
    const uid = getCardUid();
    if (!uid) return alert('Insira um cartão válido para comprar.');

    const button = event.target;
    const credits = parseInt(button.getAttribute('data-credits'), 10);
    const amount = parseFloat(button.getAttribute('data-amount'));

    try {
        const response = await fetch(`${API_BASE_URL}/financial-transactions/buy`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid, credits, amount })
        });

        const data = await response.json();

        if (response.ok) {
            alert(`${data.message}\nNovo Saldo: ${data.newBalance} créditos.`);
        } else {
            alert(`Erro: ${data.error}`);
        }
    } catch (error) {
        console.error('Erro ao comprar créditos:', error);
        alert('Não foi possível conectar ao servidor.');
    }
}

// Executa a requisição de troca de tickets/pontos por créditos (Ação: Trocar)
async function handleRedeemPoints(event) {
    const uid = getCardUid();
    if (!uid) return alert('Insira um cartão válido para trocar pontos.');

    const button = event.target;
    const credits = parseInt(button.getAttribute('data-credits'), 10);
    const pointsRequired = parseInt(button.getAttribute('data-points'), 10);

    try {
        const response = await fetch(`${API_BASE_URL}/financial-transactions/redeem`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid, credits, pointsRequired })
        });

        const data = await response.json();

        if (response.ok) {
            alert(`${data.message}\nNovo Saldo: ${data.newBalance} créditos.`);
        } else {
            alert(`Erro: ${data.error}`);
        }
    } catch (error) {
        console.error('Erro ao resgatar pontos:', error);
        alert('Não foi possível conectar ao servidor.');
    }
}

// Inicializa os escutadores de eventos da página
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();

    // Vincula a ação de todos os botões de Comprar
    document.querySelectorAll('.btn-buy-action').forEach(btn => {
        btn.addEventListener('click', handleBuyCredits);
    });

    // Vincula a ação de todos os botões de Trocar
    document.querySelectorAll('.btn-redeem-action').forEach(btn => {
        btn.addEventListener('click', handleRedeemPoints);
    });
});
