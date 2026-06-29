const API_BASE_URL = "http://localhost:3000";

// Dicionário para gerenciar instâncias de gráficos ativos e evitar erros de re-renderização
const chartInstances = {};

function createMiniChart(canvasId, labels, dataPoints, strokeColor) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const existingChart = Chart.getChart(canvas); // Pass the element instead of string ID
    if (existingChart) {
        existingChart.destroy();
    }

    if (chartInstances[canvasId]) {
        chartInstances[canvasId].destroy();
    }

    const ctx = canvas.getContext('2d');

    chartInstances[canvasId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: dataPoints,
                borderColor: strokeColor,
                borderWidth: 1.8,
                pointRadius: 0, // Remove círculos para o design limpo do mini-chart
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { display: false },
                y: { display: false }
            }
        }
    });
}

let isLayoutLoading = false
async function loadDashboardKPIs() {
    if(isLayoutLoading) return
    isLayoutLoading = true
    try {
        const response = await fetch(`${API_BASE_URL}/reports/admin/dashboard`);
        if (!response.ok) throw new Error("Erro na comunicação de dados.");

        const data = await response.json();

        // 1. Injeção de valores nos textos de KPI
        document.getElementById('kpi-games-today').textContent = data.gamesToday.toLocaleString('pt-BR');
        document.getElementById('kpi-cards-today').textContent = data.activeCards.toLocaleString('pt-BR');
        document.getElementById('kpi-revenue-today').textContent = `R$ ${data.revenueToday.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

        // 2. Renderização segura de cada um dos três mini-gráficos lineares
        createMiniChart('dailyGamesChart', data.labels, data.chartGames, '#00e5ff');
        createMiniChart('OnCardsChart', data.labels, data.chartCards, '#ff007f');
        createMiniChart('DailyRevenueChart', data.labels, data.chartRevenue, '#00ff88');

    } catch (error) {
        console.error("Falha ao renderizar dados estruturais no dashboard:", error);
    } finally {
      isLayoutLoading = false
    }
}

document.removeEventListener('DOMContentLoaded', loadDashboardKPIs);
document.addEventListener('DOMContentLoaded', loadDashboardKPIs);